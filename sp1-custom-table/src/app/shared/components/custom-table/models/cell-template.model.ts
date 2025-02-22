export type CellTemplate = 'button' | 'checkbox';
export type CellTemplateConfig = ButtonTemplate | CheckboxTemplate;

export interface ButtonTemplate {
  type: 'button';
  label: string;
  clickFunc?: (row: any) => void;
}

export interface CheckboxTemplate {
  type: 'checkbox';
  checked: boolean;
  // changeFunc?: (checked: boolean, row: any) => void;
}