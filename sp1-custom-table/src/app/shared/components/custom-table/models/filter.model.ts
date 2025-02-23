/**
 * Represents a column filter.
 */
export type ColumnFilter = TextFilter | SelectFilter | SingleDateFilter | DateRangeFilter;

/**
 * Represents a table filter configuration.
 */
export interface TableFilter {
  /**
   * ID for filter input element.
   * @type {string}
   * @optional
   */
  id?: string;
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
export interface BaseColumnFilter {
  /**
   * Type of filter.
   * @type {string}
   */
  type: string;
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
   * Custom filter logic.
   * @param {any} data - The data to filter.
   * @param {string} filter - The filter value.
   * @returns {boolean} - Whether the data matches the filter.
   * @type {function}
   * @optional
   */
  filterPredicate?: (data: any, filter: string) => boolean;
}

/**
 * Represents a text filter configuration.
 */
interface TextFilter extends BaseColumnFilter {
  /**
   * Discriminator to distinguish this as a text filter.
   * @type {'text'}
   */
  type: 'text';
  /**
   * Determines if the filter should execute instantly.
   * @type {boolean}
   * @optional
   */
  instantSearch?: boolean;
}

/**
 * Represents a select filter configuration.
 * @template T - The type of the options.
 */
interface SelectFilter<T = any> extends BaseColumnFilter {
  /**
   * Discriminator to distinguish this as a select filter.
   * @type {'select'}
   */
  type: 'select';
  /**
   * Array of options for the select filter.
   * @returns {T[]} - The options for the select filter.
   * @type {function}
   */
  options: () => T[];
  /**
   * Whether the select filter allows multiple selections.
   * @type {boolean}
   * @optional
   */
  multiple?: boolean;
}

/**
 * Represents a single date filter configuration.
 */
interface SingleDateFilter extends BaseColumnFilter {
  /**
   * Discriminator to distinguish this as a single date filter.
   * @type {'singleDate'}
   */
  type: 'singleDate';
}

/**
 * Represents a date range filter configuration.
 */
interface DateRangeFilter extends BaseColumnFilter {
  /**
   * Discriminator to distinguish this as a date range filter.
   * @type {'dateRange'}
   */
  type: 'dateRange';
}