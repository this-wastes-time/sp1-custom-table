import { Type } from '@angular/core';

export interface Column {
  field: string; // Field name in the data object
  header: string; // Display name of the column
  cellClass?: (row: any) => string | string[]; // Function to determine CSS class for a cell
  valueGetter?: (row: any) => any; // Function to determine the displayed value in the cell
  sortable?: boolean; // Whether the column is sortable
  component?: Type<any>; // Component to render dynamically
  componentInputs?: (row: any) => Record<string, unknown>; // Function to determine inputs to pass to the component
}
