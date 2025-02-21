import { CellTemplate, CellTemplateConfig } from './cell-template.model';
import { ColumnFilter } from './filter.model';


export interface ColumnsConfig {
  columns: Column[]; // Array of column configurations
  stickyHeaders?: boolean; // Whether column headers should be sticky
  showHideColumns?: boolean; // Whether columns can be modified via hiding.
  reorderColumns?: boolean; // Enables/disables column reordering
}

export interface Column {
  field: string; // Field name in the data object
  header: string; // Display name of the column
  cellClass?: (row: any) => string | string[]; // Function to determine CSS class for a cell
  valueGetter?: (row: any) => any; // Function to determine the displayed value in the cell
  sortable?: boolean; // Whether the column is sortable
  cellTemplate?: CellTemplate; // Custom template for rendering column content
  templateInputs?: (row: any) => CellTemplateConfig; // Function to determine input configuration to pass to the template
  filterOptions?: ColumnFilter; // Configuration for column filter
  align?: 'left' | 'center' | 'right'; // Determine alignment of column text.
  visible?: boolean; // Whether column is visible
}
