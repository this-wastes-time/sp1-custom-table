import { SortDirection } from '@angular/material/sort';

/**
 * Configuration options for table sorting.
 * @template T - The type of the table row data.
 */
export interface SortConfig<T> {
  /**
   * Defines the initial sorting configuration when the table is first loaded.
   * If not provided, the table will be unsorted by default.
   */
  initialSort?: InitialSort;

  /**
   * Custom function to determine how items are sorted.
   * Allows defining custom sorting behavior beyond default string or number comparisons.
   *
   * @param item - The row data being sorted.
   * @param property - The property key to sort by.
   * @returns The computed value used for sorting.
   *
   * @example
   * ```typescript
   * sortFunc: (item, property) => property === 'price' ? item.price * -1 : item[property]
   * ```
   */
  sortFunc?: (item: T, property: string) => string | number;
}

/**
 * Defines the initial sorting state of the table.
 */
interface InitialSort {
  /**
   * The column field name used for initial sorting.
   */
  active: string;

  /**
   * The sorting direction, either ascending ('asc') or descending ('desc').
   */
  direction: SortDirection;
}
