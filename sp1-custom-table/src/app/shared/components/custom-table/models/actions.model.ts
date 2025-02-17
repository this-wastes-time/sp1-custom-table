export interface TableAction {
  label: string; // The text label displayed for the action
  description: string; // Optional description of the action
  action: (rows?: any[]) => void; // A function executed when the action is triggered
  disabled?: (rows?: any[]) => boolean; // A function to determine if the action should be disabled
}

export interface RowActionsConfig {
  stickyActions: boolean; // Whether the actions column should be sticky
  actions: RowAction[]; // Array of actions avzailable for each row
}

interface RowAction {
  label: string; // The text label displayed for the action
  description: string; // Optional description of the action
  action: (row: any) => void; // A function executed when the action is triggered
  disabled?: (row: any) => boolean; // A function to determine if the action should be disabled
}

export interface SelectedRowAction {
  label: string; // The text label displayed for the action
  description: string; // Optional description of the action
  action: (rows?: any[]) => void; // A function executed when the action is triggered
  disabled?: (rows?: any[]) => boolean; // A function to determine if the action should be disabled
}