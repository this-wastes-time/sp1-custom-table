/**
 * Represents an action that can be performed on the table.
 * @template T - The type of the rows in the table.
 */
export interface TableAction {
  /**
   * The text label displayed for the action.
   * @type {string}
   */
  label: string;
  /**
   * Optional description of the action.
   * @type {string}
   * @optional
   */
  description?: string;
  /**
   * A function executed when the action is triggered.
   * @type {function}
   */
  action: () => void;
  /**
   * A function to determine if the action should be disabled.
   * @returns {boolean} - Whether the action is disabled.
   * @type {function}
   * @optional
   */
  disabled?: () => boolean;
}

/**
 * Configuration for row actions.
 */
export interface RowActionsConfig {
  /**
   * Whether the actions column should be sticky.
   * @type {boolean}
   */
  stickyActions: boolean;
  /**
   * Array of actions available for each row.
   * @type {RowAction<any>[]}
   */
  actions: RowAction<any>[];
}

/**
 * Represents an action that can be performed on a row.
 * @template T - The type of the row.
 */
interface RowAction<T> {
  /**
   * The text label displayed for the action.
   * @type {string}
   */
  label: string;
  /**
   * Optional description of the action.
   * @type {string}
   * @optional
   */
  description?: string;
  /**
   * A function executed when the action is triggered.
   * @param {T} row - The row on which the action is performed.
   * @type {function}
   */
  action: (row: T) => void;
  /**
   * A function to determine if the action should be disabled.
   * @param {T} row - The row on which the action is performed.
   * @returns {boolean} - Whether the action is disabled.
   * @type {function}
   * @optional
   */
  disabled?: (row: T) => boolean;
}

/**
 * Represents an action that can be performed on selected rows.
 * @template T - The type of the rows in the table.
 */
export interface SelectedRowAction<T> {
  /**
   * The text label displayed for the action.
   * @type {string}
   */
  label: string;
  /**
   * Optional description of the action.
   * @type {string}
   * @optional
   */
  description?: string;
  /**
   * A function executed when the action is triggered.
   * @param {T[]} [rows] - The rows on which the action is performed.
   * @type {function}
   */
  action: (rows?: T[]) => void;
  /**
   * A function to determine if the action should be disabled.
   * @returns {boolean} - Whether the action is disabled.
   * @type {function}
   * @optional
   */
  disabled?: () => boolean;
}