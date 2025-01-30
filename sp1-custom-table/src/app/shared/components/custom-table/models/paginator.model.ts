export interface Pagination {
  accessibleLabel: string; // Aria label accessible description
  page?: number; // Current page number (1-based index), seemingly unnecessary..
  pageSize?: number; // Number of items per page, seemingly unnecessary..
  pageSizeOptions?: number[]; // Array of selectable page size options (e.g., [5, 10, 25])
  showFirstLast?: boolean; // Whether to show the first and last paginator navigation options
}
