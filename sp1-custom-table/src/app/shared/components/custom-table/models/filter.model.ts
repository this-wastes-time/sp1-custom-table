export declare type FilterType = 'text' | 'select' | 'singleDate' | 'dateRange';

export interface TableFilter {
  id?: string; // ID for filter input element
  label?: string; // Label for filter input
  placeholder?: string; // Placeholder text for filter input
  instantSearch?: boolean; // Determines if the filter should search instantly
}

export interface ColumnFilter {
  type: FilterType; // Type of filter
  label?: string; // Label for filter input
  placeholder?: string; // Placeholder text for filter input
  filterPredicate?: (data: any, filter: string) => boolean; // Custom filter logic
  templateInputs?: () => Record<string, unknown>; // Function to determine inputs to pass to the template
}