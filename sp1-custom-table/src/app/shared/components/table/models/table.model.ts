import { SearchBarConfig } from './filter.model';
import { ColumnsConfig } from './column.model';
import { RowActionsConfig, TableAction, SelectedRowAction } from './actions.model';
import { SortConfig } from './sort.model';
import { AutoRefreshConfig } from './auto-refresh.model';
import { RowsConfig } from './rows.model';

/**
 * Configuration options for a table component.
 * 
 * @template T - The type of data represented in each row.
 */
export interface TableConfig<T> {
  /**
   * Unique identifier for the table element.
   */
  id: string;

  /**
   * Accessibility caption describing the table.
   */
  caption: string;

  /**
   * Configuration for table columns.
   */
  columnsConfig: ColumnsConfig;

  /**
   * Configuration for table rows.
   */
  rowsConfig?: RowsConfig<T>;

  /**
   * Configuration for automatically refreshing table data.
   */
  autoRefresh?: AutoRefreshConfig;

  /**
   * Configuration for table sorting options.
   */
  sortOptions?: SortConfig<T>;

  /**
   * List of actions that can be performed on the table.
   */
  tableActions?: TableAction[];

  /**
   * List of actions applicable to multiple selected rows.
   */
  selectedRowActions?: SelectedRowAction<T>[];

  /**
   * Configuration for actions available on individual rows.
   */
  rowActions?: RowActionsConfig;

  /**
   * Configuration for the table's search bar filter.
   */
  searchBarConfig?: SearchBarConfig;
}
