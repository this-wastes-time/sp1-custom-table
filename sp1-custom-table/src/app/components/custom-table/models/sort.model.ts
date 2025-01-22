import { SortDirection } from '@angular/material/sort';

interface initialSort {
  active: string; // Field name to sort by
  direction: SortDirection // Sort direction
}

export interface Sort {
  initialSort?: initialSort; // Initial sort configuration
  disabled?: boolean; // Whether the sort is disabled
  sortFunc?: (item: any, property: string) => string | number; // Custom sort function
}