export interface RowsConfig<T> {
  /**
   * Determines whether to display row numbers.
   *
   * @default false
   */
  showRowNumbers?: boolean;

  /**
   * Enables multi-row selection mode.
   *
   * @default false
   */
  multiRowSelection?: boolean;

  /**
   * Determines whether rows should have a hover effect.
   *
   * @default false
   */
  hover?: boolean;

  /**
   * Determines whether rows should have alternating row colors.
   *
   * @default false
   */
  zebraRows?: boolean;

  /**
   * Function to determine the CSS class(es) applied to a row.
   *
   * @param row - The row data.
   * @returns A string or an array of CSS class names.
   *
   * @example
   * ```typescript
   * rowClass: (row) => row.active ? 'highlight' : 'dimmed'
   * ```
   */
  rowClass?: (row: T) => string | string[];
}