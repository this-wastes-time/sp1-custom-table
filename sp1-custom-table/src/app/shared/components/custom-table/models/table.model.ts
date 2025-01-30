import { ColumnsConfig } from './column.model';
import { TableFilter } from './filter.model';
import { RowActionsConfig, TableAction } from './actions.model';
import { SortConfig } from './sort.model';
import { Pagination } from './paginator.model';

export interface Table {
  id: string; // ID for table element
  caption: string; // Accessibility caption for the table
  columnsConfig: ColumnsConfig; // Configuration for columns
  showRowNumbers?: boolean; // Whether to display a numbered row
  rowClass?: (row: any) => string | string[]; // Function to determine CSS class for a row
  sortOptions?: SortConfig; // Configuration for sorting
  tableActions?: TableAction[]; // Array of table actions. Some batch row action or clearing all filters.
  rowActions?: RowActionsConfig; // Configuration for row actions
  filterOptions?: TableFilter; // Configuration for table filter
  pagination?: Pagination; // Configuration for CLIENT SIDE pagination, this configuration is not for SERVER SIDE pagination.
}