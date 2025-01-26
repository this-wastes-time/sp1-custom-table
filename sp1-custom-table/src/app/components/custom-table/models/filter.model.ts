export declare type FilterType = 'text' | 'select' | 'date';

export interface TableFilter {
  id?: string; // ID for filter input element
  label?: string; // Label for filter input
  placeholder?: string; // Placeholder text for filter input
  instantSearch?: boolean; // Determines if the filter should search instantly
}

export interface ColumnFilter {
  type: FilterType; // Type of filter
  filterable: boolean; // Determines if the column has a filter
  label?: string; // Label for filter input
  placeholder?: string; // Placeholder text for filter input
  filterPredicate?: (data: any, filter: string) => boolean; // Custom filter logic
}