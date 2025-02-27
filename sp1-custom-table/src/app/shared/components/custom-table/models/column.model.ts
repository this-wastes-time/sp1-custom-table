import { ColumnFilter } from './filter.model';

/**
 * Represents a column configuration.
 * @template T - The type of the rows in the table.
 */
export type Column<T> = TextColumn<T> | ButtonColumn<T> | CheckboxColumn<T>;

/**
 * Configuration for columns.
 */
export interface ColumnsConfig {
  /**
   * Array of column configurations.
   * @type {Column<any>[]}
   */
  columns: Column<any>[];
  /**
   * Whether column headers should be sticky.
   * @type {boolean}
   * @optional
   */
  stickyHeaders?: boolean;
  /**
   * Whether columns can be modified via hiding.
   * @type {boolean}
   * @optional
   */
  showHideColumns?: boolean;
  /**
   * Enables/disables column reordering.
   * @type {boolean}
   * @optional
   */
  reorderColumns?: boolean;
}

/**
 * Base interface for column configurations.
 * @template T - The type of the rows in the table.
 */
interface BaseColumn<T> {
  /**
   * Type to distinguish this as a column.
   * @type {string}
   */
  type: string;
  /**
   * Field name in the data object.
   * @type {string}
   */
  field: string;
  /**
   * Display name of the column.
   * @type {string}
   */
  header: string;
  /**
   * Function to determine CSS class for a cell.
   * @param {T} row - The row data.
   * @returns {string | string[]} - CSS class or classes for the cell.
   * @type {function}
   * @optional
   */
  cellClass?: (row: T) => string | string[];
  /**
   * Function to determine the displayed value in the cell.
   * @param {T} row - The row data.
   * @returns {any} - The value to display in the cell.
   * @type {function}
   * @optional
   */
  valueGetter?: (row: T) => any;
  /**
   * Whether the column is sortable.
   * @type {boolean}
   * @optional
   */
  sortable?: boolean;
  /**
   * Configuration for column filter.
   * @type {ColumnFilter}
   * @optional
   */
  filterOptions?: ColumnFilter<T>;
  /**
   * Determine alignment of column text.
   * @type {'left' | 'center' | 'right'}
   * @optional
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Whether column is visible.
   * @type {boolean}
   * @optional
   */
  visible?: boolean;
}

/**
 * Represents a text column configuration.
 * @template T - The type of the rows in the table.
 */
interface TextColumn<T> extends BaseColumn<T> {
  /**
   * Discriminator to distinguish this as a text column.
   * @type {'text'}
   */
  type: 'text';
}

/**
 * Represents a button column configuration.
 * @template T - The type of the rows in the table.
 */
interface ButtonColumn<T> extends BaseColumn<T> {
  /**
   * Discriminator to distinguish this as a button column.
   * @type {'button'}
   */
  type: 'button';
  /**
   * Label for the button.
   * @param {T} row - The row data.
   * @returns {string} - The label for the button.
   * @type {function}
   */
  label: (row: T) => string;
  /**
   * Function to handle button click.
   * @param {T} row - The row data.
   * @type {function}
   */
  onClick: (row: T) => void;
}

/**
 * Represents a checkbox column configuration.
 * @template T - The type of the rows in the table.
 */
interface CheckboxColumn<T> extends BaseColumn<T> {
  /**
   * Discriminator to distinguish this as a checkbox column.
   * @type {'checkbox'}
   */
  type: 'checkbox';
  /**
   * Whether the checkbox is checked.
   * @param {T} row - The row data.
   * @returns {boolean} - Whether the checkbox is checked.
   * @type {function}
   */
  checked: (row: T) => boolean;
  /**
   * Function to handle checkbox change.
   * @param {boolean} checked - Whether the checkbox is checked.
   * @param {T} row - The row data.
   * @type {function}
   * @optional
   */
  onChange?: (checked: boolean, row: T) => void;
}