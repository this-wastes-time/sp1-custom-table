import { SearchBarConfig } from './filter.model';
import { ColumnsConfig } from './column.model';
import { RowActionsConfig, TableAction, SelectedRowAction } from './actions.model';
import { SortConfig } from './sort.model';

/**
 * Example usage of AutoRefreshConfig
 * @example
 * const autoRefreshConfig: AutoRefreshConfig = {
 *   enabled: true,
 *   intervalMs: 60000,
 *   autoRefreshFunc: (enabled) => { if (enabled) { refreshTableData(); } }
 * };
 */
interface AutoRefreshConfig {
  /**
   * Whether the auto-refresh is currently on
   * @type {boolean}
   */
  enabled: boolean;
  /**
   * Interval time in milliseconds
   * @type {number}
   */
  intervalMs: number;
  /**
   * Function to call to refresh table data automatically.
   * @param {boolean} enabled - Indicates if auto-refresh is enabled
   * @type {function}
   */
  autoRefreshFunc: (enabled: boolean) => void;
}

/**
 * Example usage of TableConfig
 * @example
 * const tableConfig: TableConfig<MyRowType> = {
 *   id: 'myTable',
 *   caption: 'My Table',
 *   columnsConfig: myColumnsConfig,
 *   showRowNumbers: true,
 *   multiRowSelection: false,
 *   autoRefresh: {
 *     enabled: true,
 *     intervalMs: 60000,
 *     autoRefreshFunc: (enabled) => { if (enabled) { refreshTableData(); } }
 *   },
 *   rowClass: (row) => row.isActive ? 'active-row' : 'inactive-row',
 *   sortOptions: mySortConfig,
 *   tableActions: myTableActions,
 *   selectedRowActions: mySelectedRowActions,
 *   rowActions: myRowActionsConfig,
 *   filterOptions: myTableFilter
 * };
 */
export interface TableConfig<T> {
  /**
   * ID for table element
   * @type {string}
   */
  id: string;
  /**
   * Accessibility caption for the table
   * @type {string}
   */
  caption: string;
  /**
   * Configuration for columns
   * @type {ColumnsConfig}
   */
  columnsConfig: ColumnsConfig;
  /**
   * Whether to display a numbered row
   * @type {boolean}
   * @optional
   */
  showRowNumbers?: boolean;
  /**
   * Whether table is setup for multiple selection of rows
   * @type {boolean}
   * @optional
   */
  multiRowSelection?: boolean;
  /**
   * Configuration for auto refreshing the table
   * @type {AutoRefreshConfig}
   * @optional
   */
  autoRefresh?: AutoRefreshConfig;
  /**
   * Function to determine CSS class for a row
   * @param {T} row - The row data
   * @returns {string | string[]} - CSS class or classes for the row
   * @type {function}
   * @optional
   */
  rowClass?: (row: T) => string | string[];
  /**
   * Configuration for sorting
   * @type {SortConfig<T>}
   * @optional
   */
  sortOptions?: SortConfig<T>;
  /**
   * Array of table actions
   * @type {TableAction[]}
   * @optional
   */
  tableActions?: TableAction[];
  /**
   * Array of actions that can be done in batches
   * @type {SelectedRowAction<T>[]}
   * @optional
   */
  selectedRowActions?: SelectedRowAction<T>[];
  /**
   * Configuration for row actions
   * @type {RowActionsConfig}
   * @optional
   */
  rowActions?: RowActionsConfig;
  /**
   * Configuration for table search bar filter
   * @type {SearchBarConfig}
   * @optional
   */
  searchBarConfig?: SearchBarConfig;
}