import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  ViewContainerRef,
  OnInit,
  OnDestroy
}
  from '@angular/core';
import { TableModule } from './table.module';
import { TableConfig } from './models/table.model';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ModifyColumnsComponent } from './child-components/modify-columns/modify-columns.component';
import { MatSidenav } from '@angular/material/sidenav';
import { debounceTime, map, of, Subject, takeUntil } from 'rxjs';
import { Column } from './models/column.model';
import { RowSelectionService } from './services/row-selection.service';
import { FormControl } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

const DEBOUNCE_DELAY = 500;

@Component({
  selector: 'twt-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [RowSelectionService],
  animations: [
    trigger('floatLabel', [
      state('float', style({
        transform: 'translateY(-1.5em)',
        opacity: 1,
      })),
      // Transition from placeholding to float
      transition('placeholding => float', [
        animate('0ms', style({ opacity: 0 })), // Fade out
        animate('125ms', style({ transform: 'translateY(-1.5em)' })), // Move
        animate('300ms ease-out', style({ opacity: 1 })), // Fade in
      ]),
    ]),
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // Initial state (hidden)
      state('*', style({ opacity: 1 })),    // Final state (visible)
      transition(':enter', animate('300ms ease-in')), // Fade in
      transition(':leave', animate('400ms ease-out')) // Fade out
    ])
  ],
})
export class TableComponent<T> implements OnChanges, OnInit, OnDestroy {
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

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('sidenavContent', { read: ViewContainerRef }) sidenavContent!: ViewContainerRef;

  // Table column vars.
  protected displayColumns: string[] = [];
  protected defaultColumnOrder!: Column<T>[];

  // Tooltip vars.
  protected multiRowActionMenuTooltip = 'Show more actions';

  // Search bar filter vars.
  static nextId = 0;
  protected searchBarId = `app-table-search-bar-${TableComponent.nextId++}`;
  protected defaultLabel = 'Search';
  protected defaultPlaceholder = 'Search table for...';
  protected searchControl = new FormControl('');
  protected floatState: 'placeholding' | 'float' = 'placeholding';
  private _destroy$ = new Subject<void>();

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
        const modifyColumns = {
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
        if (hasModifyAction === undefined || !hasModifyAction) {
          tableConfig.tableActions = (hasModifyAction === undefined) ? [modifyColumns] : [modifyColumns, ...tableConfig.tableActions!];
        }
      }

      this.detector.detectChanges();
    }
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(this.tableConfig.searchBarConfig?.debounceDelay ?? DEBOUNCE_DELAY),
      takeUntil(this._destroy$),
      map((value: string | null) => value = value || '')
    ).subscribe(value => {
      this.filterChange.emit(value);
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
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
   * Deselects all rows in the table regardless current page.
   */
  protected deselectAllRows(): void {
    this.rss.clearSelection();
  }

  /**
   * Handles the focus in event.
   */
  protected onFocusIn(): void {
    this.floatState = 'float';
  }

  /**
   * Handles the blur event.
   */
  protected onBlur(): void {
    this.floatState = this.searchControl.value ? 'float' : 'placeholding';
  }

  /**
   * Generates the display columns based on the column configuration.
   * @param columns - The column configuration.
   */
  private _generateDisplayColumns(columns: Column<T>[]): void {
    this.displayColumns = columns.filter(col => col.visible ?? true).map(col => col.field);

    // Include the row number column.
    if (this.tableConfig.rowsConfig?.showRowNumbers) {
      this.displayColumns.unshift('#');
    }

    // Include the multi-row select column.
    if (this.tableConfig.rowsConfig?.multiRowSelection) {
      this.displayColumns.unshift('select');
    }

    // Include the action column.
    if (this.tableConfig.rowActions) {
      this.displayColumns.push('actions');
    }
  }
}
