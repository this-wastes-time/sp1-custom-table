import { Component, EventEmitter, Output } from '@angular/core';
import { BasePaginatorComponent } from '../base-paginator/base-paginator.component';
import { CustomPaginatorModule } from '../custom-paginator.module';

/**
 * Represents the state of the paginator.
 */
interface PaginatorState {
  /**
   * The current page index.
   * @type {number}
   */
  pageIndex: number;
  /**
   * The number of items per page.
   * @type {number}
   */
  pageSize: number;
}

@Component({
  selector: 'app-server-paginator',
  standalone: true,
  imports: [CustomPaginatorModule],
  templateUrl: './server-paginator.component.html',
  styleUrl: './server-paginator.component.scss',
})
export class ServerPaginatorComponent extends BasePaginatorComponent {
  /**
   * Event emitted to fetch data based on the current pagination state.
   * @type {EventEmitter<PaginatorState>}
   */
  @Output() fetchData = new EventEmitter<PaginatorState>();

  // Label vars.
  itemsPerPageLabel = 'Items per page:';

  // Variables to determine paginator length.
  totalItemsKnown = false; // Whether totalItems has been determined
  totalPageCount!: number; // Total page count

  /**
   * Gets the total number of items.
   * @type {number | null}
   */
  get totalItems(): number | null {
    return this._totalItems;
  }

  /**
   * Sets the total number of items and updates the total page count.
   * @param {number | null} value - The total number of items.
   */
  set totalItems(value: number | null) {
    this._totalItems = value;
    this.totalItemsKnown = value !== null; // Update the state

    if (value) {
      this.totalPageCount = Math.floor(value / this.pageSize);
    }
  }
  private _totalItems: number | null = null;

  /**
   * Paginates to the target page and emits the paginated data.
   * @param {number} page - The target page index.
   */
  override paginate(page: number): void {
    super.paginate(page);
    this.emitPaginatedData();
  }

  /**
   * Handles the change in page size and emits the paginated data.
   * @param {number} newPageSize - The new page size.
   */
  protected override onPageSizeChange(newPageSize: number): void {
    super.onPageSizeChange(newPageSize);
    // Recalculate total page count, if known.
    if (this.totalItemsKnown) {
      this.totalPageCount = Math.floor(this.totalItems! / this.pageSize);
    }
    this.emitPaginatedData();
  }

  /**
   * Checks if there is a next page.
   * @returns {boolean} - True if there is a next page, false otherwise.
   */
  protected override hasNext(): boolean {
    return this.totalItemsKnown === false ? false : this.pageIndex >= (this.totalPageCount - 1);
  }

  /**
   * Checks if there is a last page.
   * @returns {boolean} - True if there is a last page, false otherwise.
   */
  protected hasLast(): boolean {
    return !this.totalItemsKnown ? true : this.pageIndex >= (this.totalPageCount - 1);
  }

  /**
   * Emits the paginated data based on the current page index and page size.
   */
  protected override emitPaginatedData(): void {
    this.fetchData.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
  }

  /**
   * Gets the range label for the current page.
   * @param {number} page - The current page index.
   * @param {number} pageSize - The current page size.
   * @returns {string} - The range label.
   */
  protected getRangeLabel = (page: number, pageSize: number): string => {
    if (!this.totalItemsKnown) {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start}–${end} of many`;
    } else {
      const start = page * pageSize + 1;
      const end = Math.min((page + 1) * pageSize, this.totalItems ?? 0);
      return `${start}–${end} of ${this.totalItems}`;
    }
  };
}
