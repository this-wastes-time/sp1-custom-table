import { SearchBarConfig } from './filter.model';
import { ColumnsConfig } from './column.model';
import { RowActionsConfig, TableAction, SelectedRowAction } from './actions.model';
import { SortConfig } from './sort.model';
import { AutoRefreshConfig } from './auto-refresh.model';

/**
 * Example usage of TableConfig
 * @example
 * const tableConfig: TableConfig<MyRowType> = {
 *   id: 'myTable',
 *   caption: 'My Table',
 *   columnsConfig: myColumnsConfig,
 *   showRowNumbers: true,
 *   multiRowSelection: false,
 *   autoRefresh: myAutoRefreshConfig,
 *   rowClass: (row) => row.isActive ? 'active-row' : 'inactive-row',
 *   sortOptions: mySortConfig,
 *   tableActions: myTableActions,
 *   selectedRowActions: mySelectedRowActions,
 *   rowActions: myRowActionsConfig,
 *   searchBarConfig: mySearchBarConfig
 * };
 */
export interface TableConfig<T> {
  /**
   * ID for table element
   */
  id: string;
  /**
   * Accessibility caption for the table
   */
  caption: string;
  /**
   * Configuration for columns
   */
  columnsConfig: ColumnsConfig;
  /**
   * Whether to display a numbered row
   * @optional
   */
  showRowNumbers?: boolean;
  /**
   * Whether table is setup for multiple selection of rows
   * @optional
   */
  multiRowSelection?: boolean;
  /**
   * Configuration for auto refreshing the table
   * @optional
   */
  autoRefresh?: AutoRefreshConfig;
  /**
   * Function to determine CSS class for a row
   * @param row - The row data
   * @returns CSS class or classes for the row
   * @optional
   */
  rowClass?: (row: T) => string | string[];
  /**
   * Configuration for sorting
   * @optional
   */
  sortOptions?: SortConfig<T>;
  /**
   * Array of table actions
   * @optional
   */
  tableActions?: TableAction[];
  /**
   * Array of actions that can be done in batches
   * @optional
   */
  selectedRowActions?: SelectedRowAction<T>[];
  /**
   * Configuration for row actions
   * @optional
   */
  rowActions?: RowActionsConfig;
  /**
   * Configuration for table search bar filter
   * @optional
   */
  searchBarConfig?: SearchBarConfig;
}