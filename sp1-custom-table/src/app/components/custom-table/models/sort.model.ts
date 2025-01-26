import { SortDirection } from '@angular/material/sort';

export interface SortConfig {
  initialSort?: initialSort; // Initial sort configuration
  disabled?: boolean; // Whether the sort is disabled
  sortFunc?: (item: any, property: string) => string | number; // Custom sort function
}

interface initialSort {
  active: string; // Field name to sort by
  direction: SortDirection // Sort direction
}