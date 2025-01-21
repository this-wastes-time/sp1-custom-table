export interface Column {
  field: string; // Field name in the data object
  header: string; // Display name of the column
  cellClass?: (row: any) => string | string[]; // Function to determine CSS class for a cell
  valueGetter?: (row: any) => any; // Function to determine the displayed value in the cell
}
