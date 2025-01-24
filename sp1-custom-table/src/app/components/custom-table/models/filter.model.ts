export declare type FilterType = 'text';

export interface TableFilter {
  id?: string; // ID for filter input element
  label?: string; // Label for filter input
  placeholder?: string; // Placeholder text for filter input
}

export interface ColumnFilter {
  type: FilterType; // Type of filter
  filterable: boolean; // Determines if the column has a filter
  label?: string; // Label for filter input
  placeholder?: string; // Placeholder text for filter input
  filterPredicate?: (data: any, filter: string) => boolean; // Custom filter logic
}