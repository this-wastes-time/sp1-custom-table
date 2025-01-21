import { Pagination } from '../../custom-paginator/models/paginator.model';
import { Column } from './column.model';
import { RowAction } from './row-action.model';

export interface Table {
  id: string; // ID for table element
  caption: string; // Accessibility caption for the table
  columns: Column[]; // Array of column configurations
  rowClass?: (row: any) => string | string[]; // Function to determine CSS class for a row
  numberedRows?: boolean; // Whether to display a numbered column
  stickyHeaders?: boolean; // Whether column headers should be sticky
  rowActions?: RowAction[]; // Array of actions available for each row
  stickyActions?: boolean; // Whether the actions column should be sticky
  pagination?: Pagination; // Configuration for pagination
}