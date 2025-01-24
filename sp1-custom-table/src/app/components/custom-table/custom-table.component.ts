import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CustomTableModule } from './custom-table.module';
import { Table } from './models/table.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table data vars.
  dataSource = new MatTableDataSource<any>(); // MatTableDataSource instance
  globalFilter!: string; // Filter string from main search box

  // Table column vars.
  displayColumns: string[] = [];
  displayColumnsFilters: string[] = [];
  columnFilters: Record<string, string> = {}; // Store filters for each column

  constructor(
    private announcer: LiveAnnouncer,
    private detector: ChangeDetectorRef
  ) {
    this.dataSource.filterPredicate = (row: any, filter: string) => {
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
      return this.tableConfig.columns.every((column) => {
        if (!column.filterOptions?.filterable || !columnFilters[column.field]) {
          return true; // Skip columns without filters
        }
        const filterValue = columnFilters[column.field].toLowerCase();
        const cellValue = row[column.field]?.toString().toLowerCase();
        return column.filterOptions.filterPredicate
          ? column.filterOptions.filterPredicate(row, filterValue)
          : cellValue.includes(filterValue);
      });
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When a table configuration comes in, set the columns.
    if (changes['tableConfig']?.currentValue) {
      this.generateDisplayColumns();
      // If any column has a filter, generate the filter columns.
      if (this.tableConfig.columns.some((col) => col.filterOptions?.filterable)) {
        this.generateDisplayColumnsFilters();
      }
    }

    // When the data for the table comes in, update the Observable.
    if (changes['tableData']?.currentValue) {
      this.dataSource.data = changes['tableData']?.currentValue ?? this.dataSource.data;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = this.tableConfig.sortOptions?.sortFunc ?? ((data, sortHeaderId) => data[sortHeaderId]);
    this.dataSource.sort = this.sort;
    this.detector.detectChanges();
  }

  private generateDisplayColumns(): void {
    this.displayColumns = this.tableConfig!.columns.map(col => col.field);

    // Include the row number column.
    if (this.tableConfig.showRowNumbers) {
      this.displayColumns.unshift('#');
    }

    // Include the action column.
    if (this.tableConfig.rowActions) {
      this.displayColumns.push('actions');
    }
  }

  private generateDisplayColumnsFilters(): void {
    this.displayColumnsFilters = this.displayColumns.map(col => `${col}-filter`);
  }

  protected getRowNumber(index: number): number {
    return this.paginator?.pageIndex * this.paginator?.pageSize + index + 1;
  }

  protected sortChange(event: Sort): void {
    const sortDirection = event.direction ? `${event.direction}ending` : 'cleared';
    this.announcer.announce(`Sorting by ${event.active} ${sortDirection}`);
  }

  protected applyFilter(filterString: string): void {
    this.globalFilter = filterString;
    this.applyFilters();
  }

  protected applyFilters() {
    // Combine global and column filters into one object for MatTableDataSource
    this.dataSource.filter = JSON.stringify({
      globalFilter: this.globalFilter,
      columnFilters: this.columnFilters,
    });
  }
}
