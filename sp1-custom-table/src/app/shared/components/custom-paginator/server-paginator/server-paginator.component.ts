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

  /**
   * Label for the items per page dropdown.
   * @type {string}
   */
  itemsPerPageLabel = 'Items per page:';

  /**
   * Indicates whether the total number of items is known.
   * @type {boolean}
   */
  totalItemsKnown = false;

  /**
   * The total number of pages.
   * @type {number}
   */
  totalPageCount!: number;

  /**
   * The current page input value.
   * This is a 1-based index representing the page number input by the user.
   * @type {number}
   */
  protected pageInput = 1;

  /**
   * The number of pages that are known.
   * @type {number}
   */
  protected knownPages = 1;

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
      this.totalPageCount = Math.ceil(value / this.pageSize);
    }
  }
  private _totalItems: number | null = null;

  /**
   * Paginates to the target page and emits the paginated data.
   * Increases known page count.
   * @param {number} page - The target page index.
   */
  override paginate(page: number): void {
    super.paginate(page);
    this.pageInput = this.pageIndex + 1;
    this.knownPages = Math.max(this.knownPages, this.pageInput);
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
      this.totalPageCount = Math.ceil(this.totalItems! / this.pageSize);
    }
    this.pageInput = 1;
    this.knownPages = 1;
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

  /**
   * Navigates to the specified page based on the user input.
   * @param {Event} event - The event triggered by the user.
   */
  protected goToPage(event: Event): void {
    // Get the value from the event target
    const value = this._getValue(event);
    const max = this.totalItemsKnown ? this.totalPageCount - 1 : this.knownPages - 1;

    // Convert the value to a zero-based page index
    let page = parseInt(value, 10) - 1;

    // Validate the page index
    if (page < 0 || page > max) {
      // If invalid, revert to the current page index
      page = this.pageIndex;
    }
    // Update the page input to reflect the current page
    this.pageInput = page + 1;

    super.paginate(page);
    this.emitPaginatedData();
  }
}
