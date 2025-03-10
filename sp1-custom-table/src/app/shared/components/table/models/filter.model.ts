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
   * The delay in milliseconds before the filter is applied.
   * Useful for reducing the number of filter operations when the user is typing.
   * @default 500
   */
  debounceDelay?: number;
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
