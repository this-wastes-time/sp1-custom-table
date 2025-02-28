/**
 * Represents a table search bar configuration.
 */
export interface SearchBarConfig {
  /**
   * Label for filter input.
   * @type {string}
   * @optional
   */
  label?: string;
  /**
   * Placeholder text for filter input.
   * @type {string}
   * @optional
   */
  placeholder?: string;
  /**
   * Determines if the filter should search instantly.
   * @type {boolean}
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
   * @param {any} data - The data to filter.
   * @param {string} filter - The filter value.
   * @returns {boolean} - Whether the data matches the filter.
   * @type {function}
   * @optional
   */
  filterPredicate?: (data: T, filter: string) => boolean;
}