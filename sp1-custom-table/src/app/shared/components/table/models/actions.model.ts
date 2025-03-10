/**
 * Represents an action that can be performed on the entire table.
 */
export interface TableAction {
  /**
   * The label displayed for the action button.
   */
  label: string;

  /**
   * An optional description providing more details about the action.
   */
  description?: string;

  /**
   * Callback function executed when the action is triggered.
   */
  action: () => void;

  /**
   * Function that determines whether the action should be disabled.
   *
   * @returns `true` if the action is disabled, otherwise `false`.
   *
   * @example
   * ```typescript
   * disabled: () => selectedRows.length === 0
   * ```
   */
  disabled?: () => boolean;
}


/**
 * Configuration for row-level actions in the table.
 */
export interface RowActionsConfig {
  /**
   * Determines whether the actions column should remain fixed while scrolling.
   */
  stickyActions: boolean;

  /**
   * List of available actions for each row.
   */
  actions: RowAction<any>[];
}

/**
 * Defines an action that can be performed on an individual row.
 * @template T - The type of the row data.
 */
interface RowAction<T> {
  /**
   * The label displayed for the action button.
   */
  label: string;

  /**
   * An optional description providing more details about the action.
   */
  description?: string;

  /**
   * Function executed when the action is triggered for a specific row.
   *
   * @param row - The row on which the action is performed.
   */
  action: (row: T) => void;

  /**
   * Function that determines if the action should be disabled for a specific row.
   *
   * @param row - The row on which the action is performed.
   * @returns `true` if the action is disabled, otherwise `false`.
   */
  disabled?: (row: T) => boolean;
}

/**
 * Defines an action that can be performed on multiple selected rows.
 * @template T - The type of the row data.
 */
export interface SelectedRowAction<T> {
  /**
   * The label displayed for the action button.
   */
  label: string;

  /**
   * An optional description providing more details about the action.
   */
  description?: string;

  /**
   * Function executed when the action is triggered for selected rows.
   *
   * @param rows - The list of selected rows.
   */
  action: (rows: T[]) => void;

  /**
   * Function that determines if the action should be disabled for selected rows.
   *
   * @param rows - The list of selected rows.
   * @returns `true` if the action is disabled, otherwise `false`.
   */
  disabled?: (rows: T[]) => boolean;
}
