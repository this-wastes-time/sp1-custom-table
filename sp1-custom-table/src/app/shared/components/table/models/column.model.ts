import { ColumnFilter } from './filter.model';

/**
 * Defines the configuration for a column in the table.
 * Supports multiple column types such as text, button, checkbox, and slide toggle.
 * @template T - The type of the table row data.
 */
export type Column<T> = TextColumn<T> | ButtonColumn<T> | CheckboxColumn<T> | SlideToggleColumn<T>;

/**
 * Configuration settings for table columns.
 */
export interface ColumnsConfig {
  /**
   * List of column configurations.
   */
  columns: Column<any>[];

  /**
   * Enables sticky column headers.
   * If `true`, column headers remain fixed at the top while scrolling.
   * @default false
   */
  stickyHeaders?: boolean;

  /**
   * Allows users to toggle column visibility.
   * If `true`, columns can be shown or hidden dynamically.
   * @default false
   */
  showHideColumns?: boolean;

  /**
   * Enables column reordering.
   * If `true`, users can change the order of columns.
   * @default false
   */
  reorderColumns?: boolean;
}

/**
 * Example configuration for a user table.
 * 
 * ```typescript
 * const userColumns: Column<User>[] = [
 *   { type: 'text', field: 'name', header: 'Name', sortable: true },
 *   { type: 'checkbox', field: 'active', header: 'Active', checked: row => row.active }
 * ];
 * ```
 */

/**
 * Base interface for column configurations.
 * @template T - The type of the table row data.
 */
export interface BaseColumn<T> {
  /**
   * Identifies the type of the column.
   * Used to differentiate between column types.
   */
  type: string;

  /**
   * Specifies the data field associated with this column.
   * Example: If `field = 'name'`, then `row['name']` is displayed in this column.
   */
  field: string;

  /**
   * The header text displayed for the column.
   */
  header: string;

  /**
   * Defines the text alignment for column content.
   * Acceptable values: `'left'`, `'center'`, `'right'`.
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Controls column visibility.
   * If `false`, the column is hidden.
   * @default true
   */
  visible?: boolean;

  /**
   * Enables sorting for the column.
   * If `true`, the column can be sorted.
   * @default false
   */
  sortable?: boolean;

  /**
   * Applies custom CSS classes to the column cells.
   * 
   * @param row - The row data.
   * @returns A string or an array of CSS class names.
   * 
   * @example
   * ```typescript
   * cellClass: (row) => row.active ? 'highlight' : 'dimmed'
   * ```
   */
  cellClass?: (row: T) => string | string[];

  /**
   * Customizes how the cell content is displayed.
   * 
   * @param row - The row data.
   * @returns The processed value to be displayed in the cell.
   * 
   * @example
   * ```typescript
   * valueGetter: (row) => `${row.firstName} ${row.lastName}`
   * ```
   */
  valueGetter?: (row: T) => any;

  /**
   * Defines filtering options for the column.
   */
  filterOptions?: ColumnFilter<T>;
}

/**
 * Configuration for a text column.
 * @template T - The type of the table row data.
 */
interface TextColumn<T> extends BaseColumn<T> {
  /**
   * Identifies this column as a text column.
   */
  type: 'text';

  /**
   * Specifies the maximum number of characters to display in the cell.
   * Content beyond this limit may be truncated.
   *
   * @default undefined
   * 
   * @example
   * ```typescript
   * truncationLimit: 50 // Limits the content to 50 characters
   * ```
   */
  truncationLimit?: number;
}

/**
 * Configuration for a button column.
 * @template T - The type of the table row data.
 */
interface ButtonColumn<T> extends BaseColumn<T> {
  /**
   * Identifies this column as a button column.
   */
  type: 'button';

  /**
   * Defines the button label.
   * 
   * @param row - The row data.
   * @returns The button label text.
   */
  label: (row: T) => string;

  /**
   * Handles button click events.
   * 
   * @param row - The row data.
   */
  onClick: (row: T) => void;
}

/**
 * Configuration for a checkbox column.
 * @template T - The type of the table row data.
 */
interface CheckboxColumn<T> extends BaseColumn<T> {
  /**
   * Identifies this column as a checkbox column.
   */
  type: 'checkbox';

  /**
   * Determines whether the checkbox is checked.
   * 
   * @param row - The row data.
   * @returns `true` if checked, otherwise `false`.
   */
  checked: (row: T) => boolean;
}

/**
 * Configuration for a slide toggle column.
 * @template T - The type of the table row data.
 */
interface SlideToggleColumn<T> extends BaseColumn<T> {
  /**
   * Identifies this column as a slide toggle column.
   */
  type: 'slideToggle';

  /**
   * Determines whether the slide toggle is enabled.
   * 
   * @param row - The row data.
   * @returns `true` if enabled, otherwise `false`.
   */
  checked: (row: T) => boolean;
}
