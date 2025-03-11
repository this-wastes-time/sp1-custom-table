import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BasePaginatorComponent } from '../base-paginator/base-paginator.component';
import { PaginatorModule } from '../paginator.module';

@Component({
  selector: 'twt-client-paginator',
  standalone: true,
  imports: [PaginatorModule],
  templateUrl: './client-paginator.component.html',
  styleUrl: './client-paginator.component.scss',
  host: {
    role: 'group',
  },
})
export class ClientPaginatorComponent extends BasePaginatorComponent implements OnChanges {
  /**
   * The total data to be paginated.
   */
  @Input() totalData: any[] = [];

  /**
   * Event emitted with the paginated data.
   */
  @Output() paginatedData = new EventEmitter<any[]>();

  /**
   * The current page input value.
   * This is a 1-based index representing the page number input by the user.
   */
  protected pageInput = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalData']?.currentValue) {
      this.length = changes['totalData'].currentValue.length;
      this.emitPaginatedData();
    }
  }

  /**
   * Paginates to the target page and emits the paginated data.
   * @param page - The target page index.
   */
  override paginate(page: number): void {
    super.paginate(page);
    this.pageInput = page + 1;
    this.emitPaginatedData();
  }

  /**
   * Handles the change in page size and emits the paginated data.
   * @param newPageSize - The new page size.
   */
  protected override onPageSizeChange(newPageSize: number): void {
    super.onPageSizeChange(newPageSize);
    this.pageInput = 1;
    this.emitPaginatedData();
  }

  /**
   * Emits the paginated data based on the current page index and page size.
   */
  protected override emitPaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData.emit(this.totalData.slice(startIndex, endIndex));
  }

  /**
   * Navigates to the specified page based on the user input.
   * @param event - The event triggered by the user.
   */
  protected goToPage(event: Event): void {
    // Get the value from the event target
    const value = this._getValue(event);

    // Convert the value to a zero-based page index
    let page = parseInt(value, 10) - 1;

    // Validate the page index
    if (page < 0 || page > (this.totalPages - 1)) {
      // If invalid, revert to the current page index
      page = this.pageIndex;
    }
    // Update the page input to reflect the current page
    this.pageInput = page + 1;

    super.paginate(page);
    this.emitPaginatedData();
  }
}
