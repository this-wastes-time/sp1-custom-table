import { Component, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { TableModule } from './table.module';
import { TableConfig } from './models/table.model';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ModifyColumnsComponent } from './child-components/modify-columns/modify-columns.component';
import { MatSidenav } from '@angular/material/sidenav';
import { of } from 'rxjs';
import { Column } from './models/column.model';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { RowSelectionService } from './services/row-selection.service';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [TableModule, SearchBarComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [RowSelectionService]
})
export class TableComponent<T> implements OnChanges {
  /**
   * Table configuration.
   */
  @Input() tableConfig!: TableConfig<T>;

  /**
   * Data to be displayed in the table.
   */
  @Input() tableData: T[] = [];

  /**
   * Current page index.
   */
  @Input() pageIndex!: number;

  /**
   * Number of items per page.
   */
  @Input() pageSize!: number;

  /**
   * Loading state of the table.
   */
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

  /**
   * Event emitted when search bar value changes.
   */
  @Output() filterChange = new EventEmitter<string>();

  /**
   * Event emitted when sort changes.
   */
  @Output() sortChange = new EventEmitter<Sort>();

  @ViewChild('searchBar') searchBar!: SearchBarComponent;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('sidenavContent', { read: ViewContainerRef }) sidenavContent!: ViewContainerRef;

  // Table column vars.
  protected displayColumns: string[] = [];
  protected defaultColumnOrder!: Column<T>[];

  // Tooltip vars.
  protected multiRowActionMenuTooltip = 'Show more actions';

  // Magic animation var.
  protected loadingTail!: boolean;

  constructor(
    private announcer: LiveAnnouncer,
    private detector: ChangeDetectorRef,
    private rss: RowSelectionService<T>,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // When a table configuration comes in, set the columns.
    if (changes['tableConfig']?.currentValue) {
      const tableConfig = changes['tableConfig'].currentValue as TableConfig<T>;
      // Generate the table display.
      this._generateDisplayColumns(tableConfig.columnsConfig.columns);
      // Store the default column configuration.
      this.defaultColumnOrder = tableConfig.columnsConfig.columns;
      this.defaultColumnOrder.forEach(col => col.visible = col.visible ?? true);

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
            modColumns.instance.defaultCols = this.defaultColumnOrder;
            // Trigger change detection to ensure the columns$ observable is received
            this.detector.detectChanges();
            // Toggle sidenav visibility.
            this.sidenav.toggle();
            // Subscribe to the emitted event
            const sub = modColumns.instance.columnMods.subscribe((updatedCols: Column<T>[]) => {
              // Update table configuration.
              this.tableConfig.columnsConfig.columns = updatedCols;
              // Update columns.
              this._generateDisplayColumns(updatedCols);
              // Clean up the subscription and component reference
              sub.unsubscribe();
              modColumns.destroy();
              // Toggle sidenav visibility.
              this.sidenav.toggle();
            });
          }
        };

        // Check if modifying the columns has already been added
        // Author note: this is checked for the same table being created with the same configuration object.
        const hasModifyAction = tableConfig.tableActions?.some(action => action.label === 'Modify columns');
        if (tableConfig.tableActions && !hasModifyAction) {
          tableConfig.tableActions.unshift(showHideCols);
        }
      }

      this.detector.detectChanges();
    }
  }

  /**
   * Gets the row number based on the index.
   * @param index - The index of the row.
   * @returns The row number.
   */
  protected getRowNumber(index: number): number {
    return this.pageIndex * this.pageSize + index + 1;
  }

  /**
   * Emits the filter change event.
   * @param filterString - The filter string.
   */
  protected onFilterChange(filterString: string): void {
    this.filterChange.emit(filterString);
  }

  /**
   * Handles sort change event and emits teh sort change event.
   * @param event - The sort event.
   */
  protected onSortChange(event: Sort): void {
    const sortDirection = event.direction ? `${event.direction}ending` : 'cleared';
    this.announcer.announce(`Sorting by ${event.active} ${sortDirection}`);
    this.sortChange.emit(event);
  }

  /**
   * Toggles the selection of a row.
   * @param checked - Whether the row is selected.
   * @param row - The row to be selected or deselected.
   */
  protected toggleRowSelection(checked: boolean, row: T): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    checked ? this.rss.selectRow(row, this.pageIndex) : this.rss.deselectRow(row, this.pageIndex);
  }

  /**
   * Checks if a row is selected.
   * @param row - The row to check.
   * @returns True if the row is selected, false otherwise.
   */
  protected isSelected(row: T): boolean {
    return this.rss.isSelected(row, this.pageIndex);
  }

  /**
   * Toggles the selection of all rows.
   * @param checked - Whether all rows are selected.
   */
  protected toggleAllSelection(checked: boolean): void {
    if (checked) {
      this.tableData.forEach(row => this.rss.selectRow(row, this.pageIndex));
    } else {
      this.tableData.forEach(row => this.rss.deselectRow(row, this.pageIndex));
    }
  }

  /**
   * Checks if all rows are selected.
   * @returns True if all rows are selected, false otherwise.
   */
  protected readonly allSelected = (): boolean => {
    return this.tableData?.every(row => this.rss.isSelected(row, this.pageIndex));
  };

  /**
   * Checks if some rows are selected.
   * @returns True if some rows are selected, false otherwise.
   */
  protected readonly someSelected = (): boolean => {
    return this.tableData?.some(row => this.rss.isSelected(row, this.pageIndex)) &&
      !this.tableData?.every(row => this.rss.isSelected(row, this.pageIndex));
  };

  /**
   * Gets the selected rows.
   * @returns An array of selected rows.
   */
  protected getSelectedRows(): T[] {
    return this.rss.getSelectedRows();
  }

  /**
   * Generates the display columns based on the column configuration.
   * @param columns - The column configuration.
   */
  private _generateDisplayColumns(columns: Column<T>[]): void {
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
}
