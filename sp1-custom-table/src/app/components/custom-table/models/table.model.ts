import { Pagination } from '../../custom-paginator/models/paginator.model';
import { ColumnsConfig } from './column.model';
import { TableFilter } from './filter.model';
import { RowActionsConfig } from './row-action.model';
import { SortConfig } from './sort.model';

export interface Table {
  id: string; // ID for table element
  caption: string; // Accessibility caption for the table
  columnsConfig: ColumnsConfig; // Configuration for columns
  showRowNumbers?: boolean; // Whether to display a numbered row
  rowClass?: (row: any) => string | string[]; // Function to determine CSS class for a row
  sortOptions?: SortConfig; // Configuration for sorting
  rowActions?: RowActionsConfig; // Configuration for row actions
  filterOptions?: TableFilter; // Configuration for table filter
  pagination?: Pagination; // Configuration for pagination
}