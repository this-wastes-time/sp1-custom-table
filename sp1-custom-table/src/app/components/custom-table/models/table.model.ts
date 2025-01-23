import { Pagination } from '../../custom-paginator/models/paginator.model';
import { Column } from './column.model';
import { Filter } from './filter.model';
import { RowAction } from './row-action.model';
import { Sort } from './sort.model';

export interface Table {
  id: string; // ID for table element
  caption: string; // Accessibility caption for the table
  columns: Column[]; // Array of column configurations
  rowClass?: (row: any) => string | string[]; // Function to determine CSS class for a row
  showRowNumbers?: boolean; // Whether to display a numbered column
  stickyHeaders?: boolean; // Whether column headers should be sticky
  sortOptions?: Sort; // Configuration for sorting
  rowActions?: RowAction[]; // Array of actions available for each row
  stickyActions?: boolean; // Whether the actions column should be sticky
  tableFilterOptions?: Filter; // Configuration for table filter
  pagination?: Pagination; // Configuration for pagination
}