import { SortDirection } from '@angular/material/sort';

export interface SortConfig<T> {
  /**
   * Initial sort configuration
   * @optional
   */
  initialSort?: InitialSort;
  /**
   * Custom sort function
   * @param item - The item to be sorted
   * @param property - The property to sort by
   * @returns The value to sort by
   * @optional
   */
  sortFunc?: (item: T, property: string) => string | number;
}

interface InitialSort {
  /**
   * Field name to sort by
   */
  active: string;
  /**
   * Sort direction
   */
  direction: SortDirection;
}