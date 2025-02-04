import { Component, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CustomTableModule } from './custom-table.module';
import { TableConfig } from './models/table.model';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { FormControl, FormGroup } from '@angular/forms';

interface TableFilters {
  sortBy: string;
  sortDirection: string;
  globalFilter: string;
  columnFilters: Record<string, string>;
}

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CustomTableModule,],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss'
})
export class CustomTableComponent implements OnChanges {
  @Input()
  get tableConfig(): TableConfig {
    return this._tableConfig;
  }
  set tableConfig(value: TableConfig) {
    this._tableConfig = value;
  }
  private _tableConfig!: TableConfig;

  @Input() tableData: any[] = [];
  @Input() pageIndex!: number;
  @Input() pageSize!: number;
  @Input() loading!: boolean;

  @Output() getDataForTable = new EventEmitter<TableFilters>();

  @ViewChild('searchBox') searchBox!: SearchBoxComponent;

  // Table data vars.
  dataSource = new MatTableDataSource<any>(); // MatTableDataSource instance
  globalFilter!: string; // Filter string from main search box

  // Table column vars.
  displayColumns: string[] = [];
  displayColumnsFilters: string[] = [];
  columnFilters: Record<string, string> = {}; // Store filters for each column
  columnSelectFilterOptions: Record<string, any[]> = {}; // Store select dropdown filter options for each column
  readonly single = new FormGroup({
    date: new FormControl<Date | null>(null),
  });
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  currentSort!: Sort;

  // Selected rows vars.
  selectedRows!: any[]; // Store selected rows of table.

  constructor(
    private announcer: LiveAnnouncer,
    private detector: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // When a table configuration comes in, set the columns.
    if (changes['tableConfig']?.currentValue) {
      this._generateDisplayColumns();
      // If any column has a filter, generate the filter columns.
      if (this.tableConfig.columnsConfig.columns.some((col) => col.filterOptions)) {
        this._generateDisplayColumnsFilters();
      }
      // If table or column-level filters are present, add action to table.
      if (this.tableConfig?.filterOptions || this.displayColumnsFilters.length > 0) {
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

        this.tableConfig!.tableActions = [
          resetFiltersAction,
          ...(this.tableConfig!.tableActions || [])
        ];
      }
      // Set sort properties if available.
      this.currentSort = {
        active: this.tableConfig?.sortOptions?.initialSort?.active ?? '',
        direction: this.tableConfig?.sortOptions?.initialSort?.direction ?? '',
      };
      this.detector.detectChanges();
    }

    // When the data for the table comes in, update the Observable.
    if (changes['tableData']?.currentValue) {
      this.dataSource = new MatTableDataSource(changes['tableData']?.currentValue);
      this.detector.detectChanges();
    }
  }

  protected getRowNumber(index: number): number {
    return this.pageIndex * this.pageSize + index + 1;
  }

  protected sortChange(event: Sort): void {
    const sortDirection = event.direction ? `${event.direction}ending` : 'cleared';
    this.announcer.announce(`Sorting by ${event.active} ${sortDirection}`);
    this.currentSort = event;
    this._requestNewData();
  }

  protected applyFilter(filterString: string): void {
    this.globalFilter = filterString;
    this.applyFilters();
  }

  protected applyFilters() {
    this._sanitizeFilters();
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

  private _generateDisplayColumns(): void {
    this.displayColumns = this.tableConfig.columnsConfig.columns.map(col => col.field);

    // Include the row number column.
    if (this.tableConfig?.showRowNumbers) {
      this.displayColumns.unshift('#');
    }

    // Include the multi-row select column.
    if (this.tableConfig?.tableActions) {
      this.displayColumns.unshift('select');
    }

    // Include the action column.
    if (this.tableConfig?.rowActions) {
      this.displayColumns.push('actions');
    }
  }

  private _generateDisplayColumnsFilters(): void {
    this.displayColumnsFilters = this.displayColumns.map(col => `${col}-filter`);
  }

  private _isEmpty(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    if (typeof value === 'string') {
      return value.trim().length === 0;
    }
    if (typeof value === 'object' && Object.keys(value).length) {
      return Object.keys(value).every((key) => this._isEmpty(value[key]));
    }
    return !value;
  }

  private _sanitizeFilters(): void {
    // Sanitize table state before emitting.
    Object.keys(this.columnFilters).map((key) => {
      if (this._isEmpty(this.columnFilters[key])) {
        delete this.columnFilters[key];
      }
    });

    this._requestNewData();
  }

  private _requestNewData(): void {
    this.getDataForTable.emit({
      sortBy: this.currentSort.active,
      sortDirection: this.currentSort.direction,
      globalFilter: this.globalFilter,
      columnFilters: this.columnFilters,
    });
  }
}
