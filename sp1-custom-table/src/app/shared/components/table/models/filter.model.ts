/**
 * Represents a table search bar configuration.
 */
export interface SearchBarConfig {
  /**
   * Label for filter input.
   * @optional
   */
  label?: string;
  /**
   * Placeholder text for filter input.
   * @optional
   */
  placeholder?: string;
  /**
   * Determines if the filter should search instantly.
   * @optional
   */
  instantSearch?: boolean;
}

/**
 * Base interface for column filters.
 */
export interface ColumnFilter<T> {
  /**
   * Custom filter logic.
   * @param data - The data to filter.
   * @param filter - The filter value.
   * @returns Whether the data matches the filter.
   * @optional
   */
  filterPredicate?: (data: T, filter: string) => boolean;
}