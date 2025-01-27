import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CustomTableModule } from './custom-table.module';
import { Table } from './models/table.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CustomTableModule,],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss'
})
export class CustomTableComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) tableConfig!: Table;
  @Input({ required: true }) tableData!: any[];
  @Output() currentFilters = new EventEmitter<Record<string, string>>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchBox') searchBox!: SearchBoxComponent;

  // Table data vars.
  dataSource = new MatTableDataSource<any>(); // MatTableDataSource instance
  globalFilter!: string; // Filter string from main search box
  loading!: boolean; // Loading state for the table

  // Table column vars.
  displayColumns: string[] = [];
  displayColumnsFilters: string[] = [];
  columnFilters: Record<string, string> = {}; // Store filters for each column
  columnSelectFilterOptions: Record<string, any[]> = {}; // Store select dropdown filter options for each column
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // Selected rows vars.
  selectedRows!: any[]; // Store selected rows of table.

  constructor(
    private announcer: LiveAnnouncer,
    private detector: ChangeDetectorRef
  ) {
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When a table configuration comes in, set the columns.
    if (changes['tableConfig']?.currentValue) {
      this.generateDisplayColumns();
      // If any column has a filter, generate the filter columns.
      if (this.tableConfig.columnsConfig.columns.some((col) => col.filterOptions)) {
        this.generateDisplayColumnsFilters();
      }
      // If table or column-level filters are present, add action to table.
      if (this.tableConfig.filterOptions || this.displayColumnsFilters.length > 0) {
        const resetFiltersAction = {
          label: 'Reset filters',
          description: 'Clear all filters and search terms',
          action: () => {
            this.globalFilter = '';
            this.searchBox.clear();
            this.columnFilters = {};
            this.range.reset();
            this.applyFilters();
          }
        };

        this.tableConfig.tableActions = [
          resetFiltersAction,
          ...(this.tableConfig.tableActions || [])
        ];
      }
    }

    // When the data for the table comes in, update the Observable.
    if (changes['tableData']?.currentValue) {
      this.loading = true;
      this.dataSource.data = changes['tableData']?.currentValue ?? this.dataSource.data;
      this.generateColumnSelectFilterOptions();
      this.loading = false;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = this.tableConfig.sortOptions?.sortFunc ?? ((data, sortHeaderId) => data[sortHeaderId]);
    this.dataSource.sort = this.sort;
    this.detector.detectChanges();
  }

  private generateDisplayColumns(): void {
    this.displayColumns = this.tableConfig.columnsConfig.columns.map(col => col.field);

    // Include the row number column.
    if (this.tableConfig.showRowNumbers) {
      this.displayColumns.unshift('#');
    }

    // Include the multi-row select column.
    if (this.tableConfig.tableActions) {
      this.displayColumns.unshift('select');
    }

    // Include the action column.
    if (this.tableConfig.rowActions) {
      this.displayColumns.push('actions');
    }
  }

  private generateDisplayColumnsFilters(): void {
    this.displayColumnsFilters = this.displayColumns.map(col => `${col}-filter`);
  }

  private generateColumnSelectFilterOptions(): void {
    this.tableConfig.columnsConfig.columns.forEach((column) => {
      if (column.filterOptions?.type === 'select') {
        const uniqueValues = Array.from(new Set(this.dataSource.data.map((row) => row[column.field]))).sort();
        this.columnSelectFilterOptions[column.field] = uniqueValues;
      }
    });
  }

  private createFilterPredicate(): (row: any, filter: string) => boolean {
    return (row: any, filter: string): boolean => {
      const { globalFilter, columnFilters } = JSON.parse(filter);

      // Apply global filter (matches any column)
      if (globalFilter) {
        const matchesGlobal = Object.keys(row).some((key) =>
          row[key]?.toString().toLowerCase().includes(globalFilter.toLowerCase())
        );
        if (!matchesGlobal) {
          return false;
        }
      }

      // Apply column-specific filters
      return this.tableConfig.columnsConfig.columns.every((column) => {
        if (!column.filterOptions || !columnFilters[column.field] || (Array.isArray(columnFilters[column.field]) ? !columnFilters[column.field].length : !Object.keys(columnFilters[column.field]).length)) {
          return true; // Skip columns without active filters
        }

        const filterValue = columnFilters[column.field];

        if (column.filterOptions.type === 'select') {
          return filterValue.includes(row[column.field]); // Check if the row's value matches any selected option
        }

        if (column.filterOptions.type === 'date') {
          const rowDate = new Date(row[column.field]).setHours(0, 0, 0, 0);
          const filterDate = new Date(filterValue).setHours(0, 0, 0, 0);
          return rowDate === filterDate; // Compare dates
        }

        if (column.filterOptions.type === 'dateRange') {
          console.log('came here');
          const { start, end } = filterValue || {};
          if (start || end) {
            const rowDate = new Date(row[column.field]).getTime();
            const startDate = start ? new Date(start).getTime() : -Infinity;
            const endDate = end ? new Date(end).getTime() : Infinity;
            return rowDate >= startDate && rowDate <= endDate;
          }
          return true;
        }

        const cellValue = row[column.field]?.toString().toLowerCase();
        return column.filterOptions.filterPredicate
          ? column.filterOptions.filterPredicate(row, filterValue)
          : cellValue.includes(filterValue);
      });
    };
  }

  protected getRowNumber(index: number): number {
    return this.paginator?.pageIndex * this.paginator?.pageSize + index + 1;
  }

  protected sortChange(event: Sort): void {
    this.loading = true;
    const sortDirection = event.direction ? `${event.direction}ending` : 'cleared';
    this.announcer.announce(`Sorting by ${event.active} ${sortDirection}`);
    this.loading = false;
  }

  protected applyFilter(filterString: string): void {
    this.globalFilter = filterString;
    this.applyFilters();
  }

  protected applyFilters() {
    this.loading = true;
    // Combine global and column filters into one object for MatTableDataSource
    this.dataSource.filter = JSON.stringify({
      globalFilter: this.globalFilter,
      columnFilters: this.columnFilters,
    });
    this.loading = false;

    // Emit current filters to parent component.
    this.currentFilters.emit(this.columnFilters);
  }

  protected selectRow(checked: boolean, row: any): void {
    row.selected = checked;
    this.selectedRows = this.dataSource.data.filter(row => row.selected);
  }

  protected toggleAllSelection(checked: boolean): void {
    this.dataSource._pageData(this.dataSource.data).map((row) => row.selected = checked);
    this.selectedRows = this.dataSource.data.filter(row => row.selected);
  }

  // Just playing around with different function signatures..
  protected readonly allSelected = () => {
    return this.dataSource._pageData(this.dataSource.data).every((row) => row.selected);
  };

  protected readonly someSelected = () => {
    return this.dataSource._pageData(this.dataSource.data).some((row) => row.selected) &&
      !this.dataSource._pageData(this.dataSource.data).every((row) => row.selected);
  };
}
