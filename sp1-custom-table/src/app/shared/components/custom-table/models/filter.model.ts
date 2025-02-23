export type ColumnFilter = TextFilter | SelectFilter | SingleDateFilter | DateRangeFilter;

export interface TableFilter {
  id?: string; // ID for filter input element
  label?: string; // Label for filter input
  placeholder?: string; // Placeholder text for filter input
  instantSearch?: boolean; // Determines if the filter should search instantly
}

export interface BaseColumnFilter {
  type: string; // Type of filter
  label?: string; // Label for filter input
  placeholder?: string; // Placeholder text for filter input
  filterPredicate?: (data: any, filter: string) => boolean; // Custom filter logic
}

interface TextFilter extends BaseColumnFilter {
  type: 'text'; // Discriminator to distinguish this as a text filter
  instantSearch?: boolean; // Determines if the filter should execute instantly
}

interface SelectFilter<T = any> extends BaseColumnFilter {
  type: 'select'; // Discriminator to distinguish this as a select filter
  options: () => T[]; // Array of options for the select filter
  multiple?: boolean; // Whether the select filter allows multiple selections
}

interface SingleDateFilter extends BaseColumnFilter {
  type: 'singleDate'; // Discriminator to distinguish this as a single date filter
}

interface DateRangeFilter extends BaseColumnFilter {
  type: 'dateRange'; // Discriminator to distinguish this as a date range filter
}