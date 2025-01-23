import { ColumnFilter } from './filter.model';

export declare type CellTemplate = 'button' | 'checkbox';

export interface Column {
  field: string; // Field name in the data object
  header: string; // Display name of the column
  cellClass?: (row: any) => string | string[]; // Function to determine CSS class for a cell
  valueGetter?: (row: any) => any; // Function to determine the displayed value in the cell
  sortable?: boolean; // Whether the column is sortable
  cellTemplate?: CellTemplate; // Custom template for rendering column content
  templateInputs?: (row: any) => Record<string, unknown>; // Function to determine inputs to pass to the component
  filterOptions?: ColumnFilter; // Configuration for column filter
}
