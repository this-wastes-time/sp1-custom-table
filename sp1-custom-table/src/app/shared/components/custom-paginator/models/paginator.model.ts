export interface Pagination {
  accessibleLabel: string; // Aria label accessible description
  pageSize?: number; // Number of items per page
  currentPage?: number; // Current page number (1-based index)
  pageSizeOptions?: number[]; // Array of selectable page size options (e.g., [5, 10, 25])
  onPageChange?: (page: number, pageSize: number) => void; // Callback triggered when page or page size changes

  // For server-side pagination
  totalItems?: number; // Optional total items for server-side usage
}
