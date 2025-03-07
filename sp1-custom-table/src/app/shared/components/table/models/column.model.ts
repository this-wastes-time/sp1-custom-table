import { ColumnFilter } from './filter.model';

/**
 * Represents a column configuration.
 * @template T - The type of the rows in the table.
 */
export type Column<T> = TextColumn<T> | ButtonColumn<T> | CheckboxColumn<T> | SlideToggleColumn<T>;

/**
 * Configuration for columns.
 */
export interface ColumnsConfig {
  /**
   * Array of column configurations.
   */
  columns: Column<any>[];
  /**
   * Whether column headers should be sticky.
   * @optional
   */
  stickyHeaders?: boolean;
  /**
   * Whether columns can be modified via hiding.
   * @optional
   */
  showHideColumns?: boolean;
  /**
   * Enables/disables column reordering.
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
   */
  type: string;
  /**
   * Field name in the data object.
   */
  field: string;
  /**
   * Display name of the column.
   */
  header: string;
  /**
   * Function to determine CSS class for a cell.
   * @param {T} row - The row data.
   * @returns CSS class or classes for the cell.
   * @optional
   */
  cellClass?: (row: T) => string | string[];
  /**
   * Function to determine the displayed value in the cell.
   * @param {T} row - The row data.
   * @returns The value to display in the cell.
   * @optional
   */
  valueGetter?: (row: T) => any;
  /**
   * Whether the column is sortable.
   * @optional
   */
  sortable?: boolean;
  /**
   * Configuration for column filter.
   * @optional
   */
  filterOptions?: ColumnFilter<T>;
  /**
   * Determine alignment of column text.
   * @optional
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Whether column is visible.
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
   */
  type: 'button';
  /**
   * Label for the button.
   * @param {T} row - The row data.
   * @returns The label for the button.
   */
  label: (row: T) => string;
  /**
   * Function to handle button click.
   * @param {T} row - The row data.
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
   */
  type: 'checkbox';
  /**
   * Whether the checkbox is checked.
   * @param {T} row - The row data.
   * @returns Whether the checkbox is checked.
   */
  checked: (row: T) => boolean;
  /**
   * Function to handle checkbox value change.
   * @param {boolean} checked - Whether the checkbox is checked.
   * @param {T} row - The row data.
   * @optional
   */
  onChange?: (checked: boolean, row: T) => void;
}

interface SlideToggleColumn<T> extends BaseColumn<T> {
  /**
   * Discriminator to distinguish this as a slide toggle column.
   */
  type: 'slideToggle';
  /**
   * Whether the slide toggle is checked.
   * @param {T} row - The row data.
   * @returns Whether the slide toggle is checked.
   */
  checked: (row: T) => boolean;
  /**
   * Function to handle slide toggle value change.
   * @param {boolean} checked - Whether the slide toggle is checked.
   * @param {T} row - The row data.
   * @optional
   */
  onChange?: (checked: boolean, row: T) => void;
}