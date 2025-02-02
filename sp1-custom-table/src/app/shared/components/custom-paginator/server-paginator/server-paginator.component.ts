import { Component, EventEmitter, Output } from '@angular/core';
import { BasePaginatorComponent } from '../base-paginator/base-paginator.component';
import { CustomPaginatorModule } from '../custom-paginator.module';

interface PaginatorState {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-server-paginator',
  standalone: true,
  imports: [CustomPaginatorModule,],
  templateUrl: './server-paginator.component.html',
  styleUrl: './server-paginator.component.scss',
})
export class ServerPaginatorComponent extends BasePaginatorComponent {
  @Output() fetchData = new EventEmitter<PaginatorState>();

  // Label vars.
  itemsPerPageLabel = 'Items per page:';

  // Variables to determine paginator length.
  totalItemsKnown = false; // Whether totalItems has been determined
  totalPageCount!: number; // Total page 

  get totalItems(): number | null {
    return this._totalItems;
  }

  set totalItems(value: number | null) {
    this._totalItems = value;
    this.totalItemsKnown = value !== null; // Update the state

    if (value) {
      this.totalPageCount = Math.floor(value / this.pageSize);
      // Check if last page is necessary
      if (value === (this.pageIndex * this.pageSize)) {
        this.totalPageCount--;
      }
    }
  }
  private _totalItems: number | null = null;

  override paginate(page: number): void {
    super.paginate(page);
    this.emitPaginatedData();
  }

  protected override onPageSizeChange(newPageSize: number): void {
    super.onPageSizeChange(newPageSize);
    this.emitPaginatedData();
  }

  protected override hasNext(): boolean {
    return this.totalItemsKnown === false ? false : this.pageIndex >= this.totalPageCount;
  }

  protected hasLast(): boolean {
    return !this.totalItemsKnown ? true : this.pageIndex >= this.totalPageCount;
  }

  protected override emitPaginatedData(): void {
    this.fetchData.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
  }

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
