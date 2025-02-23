export interface TableAction<T> {
  label: string; // The text label displayed for the action
  description: string; // Optional description of the action
  action: (rows?: T[]) => void; // A function executed when the action is triggered
  disabled?: (rows?: T[]) => boolean; // A function to determine if the action should be disabled
}

export interface RowActionsConfig {
  stickyActions: boolean; // Whether the actions column should be sticky
  actions: RowAction<any>[]; // Array of actions avzailable for each row
}

interface RowAction<T> {
  label: string; // The text label displayed for the action
  description: string; // Optional description of the action
  action: (row: T) => void; // A function executed when the action is triggered
  disabled?: (row: T) => boolean; // A function to determine if the action should be disabled
}

export interface SelectedRowAction<T> {
  label: string; // The text label displayed for the action
  description: string; // Optional description of the action
  action: (rows?: T[]) => void; // A function executed when the action is triggered
  disabled?: (rows?: T[]) => boolean; // A function to determine if the action should be disabled
}