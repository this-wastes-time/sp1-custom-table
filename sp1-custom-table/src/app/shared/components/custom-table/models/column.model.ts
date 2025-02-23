import { ColumnFilter } from './filter.model';

export type Column<T> = TextColumn<T> | ButtonColumn<T> | CheckboxColumn<T>;

export interface ColumnsConfig {
  columns: Column<any>[]; // Array of column configurations
  stickyHeaders?: boolean; // Whether column headers should be sticky
  showHideColumns?: boolean; // Whether columns can be modified via hiding.
  reorderColumns?: boolean; // Enables/disables column reordering
}

interface BaseColumn<T> {
  type: string; // Type to distinguish this as a column
  field: string; // Field name in the data object
  header: string; // Display name of the column
  cellClass?: (row: T) => string | string[]; // Function to determine CSS class for a cell
  valueGetter?: (row: T) => any; // Function to determine the displayed value in the cell
  sortable?: boolean; // Whether the column is sortable
  filterOptions?: ColumnFilter; // Configuration for column filter
  align?: 'left' | 'center' | 'right'; // Determine alignment of column text
  visible?: boolean; // Whether column is visible
}

interface TextColumn<T> extends BaseColumn<T> {
  type: 'text'; // Discriminator to distinguish this as a text column
}

interface ButtonColumn<T> extends BaseColumn<T> {
  type: 'button'; // Discriminator to distinguish this as a button column
  label: (row: T) => string; // Label for the button
  onClick: (row: T) => void; // Function to handle button click
}

interface CheckboxColumn<T> extends BaseColumn<T> {
  type: 'checkbox'; // Discriminator to distinguish this as a checkbox column
  checked: (row: T) => boolean; // Whether the checkbox is checked
  // onChange?: (checked: boolean, row: T) => void; // Function to handle checkbox change
}