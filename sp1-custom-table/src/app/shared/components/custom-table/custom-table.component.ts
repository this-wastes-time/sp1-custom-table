import { Component, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { CustomTableModule } from './custom-table.module';
import { TableConfig } from './models/table.model';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormGroup } from '@angular/forms';
import { ModifyColumnsComponent } from './child-components/modify-columns/modify-columns.component';
import { MatSidenav } from '@angular/material/sidenav';
import { of } from 'rxjs';
import { Column } from './models/column.model';
import { SearchBarComponent } from '../search-bar/search-bar.component';

interface TableFilters {
  globalFilter: string;
  columnFilters: Record<string, any>;
}

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CustomTableModule, SearchBarComponent],
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
  @Input()
  get loading(): boolean {
    return this._loading;
  }
  set loading(value: boolean) {
    this._loading = value;
    if (value) {
      this.loadingTail = true;
    } else {
      setTimeout(() => {
        this.loadingTail = false;
      }, 500);
    }
  }
  private _loading!: boolean;

  @Output() getData = new EventEmitter();

  @ViewChild('searchBar') searchBar!: SearchBarComponent;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('sidenavContent', { read: ViewContainerRef }) sidenavContent!: ViewContainerRef;

  // Table data vars.
  protected dataSource = new MatTableDataSource<any>(); // MatTableDataSource instance
  protected globalFilter!: string; // Filter string from main search box

  // Table column vars.
  protected displayColumns: string[] = [];
  protected columnFiltersPresent!: boolean;
  protected displayedFilters!: Column[];
  protected columnFilters: Record<string, string> = {}; // Store filters for each column
  protected readonly single = new FormGroup({
    date: new FormControl<Date | null>(null),
  });
  protected readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  protected currentSort!: Sort;

  // Current table filters: global and columns.
  get filters(): TableFilters | null {
    return this._filterState;
  }
  set filters(value: TableFilters) {
    this._filterState = value;
  }
  private _filterState!: TableFilters | null;

  // Selected rows vars.
  protected selectedRows: any[] = []; // Store selected rows of table.

  // Tooltip vars.
  protected resetFiltersTooltip = 'Clear all filters and search terms';
  protected multiRowActionMenuTooltip = 'Show more';

  // Magic var.
  protected loadingTail!: boolean;

  constructor(
    private announcer: LiveAnnouncer,
    private detector: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // When a table configuration comes in, set the columns.
    if (changes['tableConfig']?.currentValue) {
      const tableConfig = changes['tableConfig'].currentValue;
      // Generate the table display.
      this._generateDisplayColumns(tableConfig.columnsConfig.columns);
      // Set filters to display.
      this.displayedFilters = tableConfig.columnsConfig.columns;
      // If any column has a filter, generate the filter columns.
      if (tableConfig.columnsConfig.columns.some((col: Column) => col.filterOptions)) {
        this.columnFiltersPresent = true;
      }

      // If showing and hiding columns is allowed, add action to table.
      if (tableConfig.columnsConfig.showHideColumns || tableConfig.columnsConfig.reorderColumns) {
        const showHideCols = {
          label: 'Modify columns',
          description: 'Open sidenav menu to modify columns by showing or hiding and reordering',
          action: () => {
            // Clear any existing content
            this.sidenavContent.clear();
            // Create the component for injection.
            const modColumns = this.sidenavContent.createComponent(ModifyColumnsComponent);
            modColumns.instance.columnConfig$ = of(this.tableConfig.columnsConfig);
            // Trigger change detection to ensure the columns$ observable is received
            this.detector.detectChanges();
            // Toggle sidenav visibility.
            this.sidenav.toggle();
            // Subscribe to the emitted event
            const sub = modColumns.instance.columnMods.subscribe((updatedCols: Column[]) => {
              // Update table configuration.
              this.tableConfig.columnsConfig.columns = updatedCols;
              // Update columns.
              this._generateDisplayColumns(updatedCols);
              console.log(updatedCols);
              this.displayedFilters = updatedCols;
              // Clean up the subscription and component reference
              sub.unsubscribe();
              modColumns.destroy();
              // Toggle sidenav visibility.
              this.sidenav.toggle();
            });
          }
        };

        tableConfig.tableActions = [
          showHideCols,
          ...(tableConfig.tableActions || [])
        ];
      }

      // Set sort properties if available.
      this.currentSort = {
        active: tableConfig.sortOptions?.initialSort?.active ?? '',
        direction: tableConfig.sortOptions?.initialSort?.direction ?? '',
      };

      this.detector.detectChanges();
    }

    // When the data for the table comes in, update the Observable.
    if (changes['tableData']?.currentValue) {
      this.dataSource = new MatTableDataSource(changes['tableData']?.currentValue);
      this.detector.detectChanges();
    }
  }

  getFilters(): TableFilters | null {
    return this.filters;
  }

  getSort(): Sort {
    return this.currentSort;
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

  protected resetFilters(): void {
    this.globalFilter = '';
    this.searchBar.clear();
    this.columnFilters = {};
    this.single.reset();
    this.range.reset();
    this.applyFilters();
  }

  private _generateDisplayColumns(columns: Column[]): void {
    this.displayColumns = columns.filter(col => col.visible ?? true).map(col => col.field);

    // Include the row number column.
    if (this.tableConfig.showRowNumbers) {
      this.displayColumns.unshift('#');
    }

    // Include the multi-row select column.
    if (this.tableConfig.multiRowSelection) {
      this.displayColumns.unshift('select');
    }

    // Include the action column.
    if (this.tableConfig.rowActions) {
      this.displayColumns.push('actions');
    }
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

    // Update filter state of table.
    this.filters = {
      globalFilter: this.globalFilter,
      columnFilters: this.columnFilters
    };

    this._requestNewData();
  }

  private _requestNewData(): void {
    this.getData.emit();
  }
}
