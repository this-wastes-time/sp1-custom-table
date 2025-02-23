import { TableFilter } from './filter.model';
import { ColumnsConfig } from './column.model';
import { RowActionsConfig, TableAction, SelectedRowAction } from './actions.model';
import { SortConfig } from './sort.model';

interface AutoRefreshConfig {
  enabled: boolean; // Whether the auto-refresh is currently on
  intervalMs: number; // Interval time in millis
  autoRefreshFunc: (enabled: boolean) => void; // Function to call to refresh table data automatically. 
}

export interface TableConfig<T> {
  id: string; // ID for table element
  caption: string; // Accessibility caption for the table
  columnsConfig: ColumnsConfig; // Configuration for columns
  showRowNumbers?: boolean; // Whether to display a numbered row
  multiRowSelection?: boolean; // Whether table is setup for multiple selection of rows
  autoRefresh?: AutoRefreshConfig; // Configuration for auto refreshing the table
  rowClass?: (row: T) => string | string[]; // Function to determine CSS class for a row
  sortOptions?: SortConfig; // Configuration for sorting
  tableActions?: TableAction<T>[]; // Array of table actions.
  selectedRowActions?: SelectedRowAction<T>[]; // Array of actions that can be done in batches.
  rowActions?: RowActionsConfig; // Configuration for row actions
  filterOptions?: TableFilter; // Configuration for table filter
}