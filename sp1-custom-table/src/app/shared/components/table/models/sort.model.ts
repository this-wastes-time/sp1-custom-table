import { SortDirection } from '@angular/material/sort';

export interface SortConfig<T> {
  /**
   * Initial sort configuration
   * @optional
   */
  initialSort?: InitialSort;
  /**
   * Custom sort function
   * @param {T} item - The item to be sorted
   * @param {string} property - The property to sort by
   * @returns {string | number} - The value to sort by
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