/**
 * Configuration options for a table search bar.
 */
export interface SearchBarConfig {
  /**
   * Label text displayed for the search input.
   * @default "Search"
   */
  label?: string;

  /**
   * Placeholder text shown inside the search input field.
   * Provides a hint for the user on what to enter.
   * @default "Search table for..."
   */
  placeholder?: string;

  /**
   * Enables instant filtering as the user types.
   * If `true`, filtering is applied immediately without waiting for a debounce.
   * @default false
   */
  instantSearch?: boolean;
}

/**
 * Base interface for defining column-specific filtering behavior.
 * @template T - The type of the row data.
 */
export interface ColumnFilter<T> {
  /**
   * Custom function for filtering column data.
   * Allows defining advanced filtering logic.
   *
   * @param data - The row data to be evaluated.
   * @param filter - The search/filter value entered by the user.
   * @returns `true` if the data matches the filter criteria, otherwise `false`.
   *
   * @example
   * ```typescript
   * filterPredicate: (data, filter) => data.name.toLowerCase().includes(filter.toLowerCase())
   * ```
   */
  filterPredicate?: (data: T, filter: string) => boolean;
}
