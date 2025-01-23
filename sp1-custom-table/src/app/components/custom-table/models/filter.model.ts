export declare type FilterType = 'text';

export interface TableFilter {
  id?: string; // ID for filter input element
  placeholder?: string; // Placeholder text for filter input
  label?: string; // Label for filter input
}

export interface ColumnFilter {
  type: FilterType; // Type of filter
  filterable: boolean; // Determines if the column has a filter
  filterPredicate?: (data: any, filter: string) => boolean; // Custom filter logic
}