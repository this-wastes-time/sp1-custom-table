import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BasePaginatorComponent } from '../base-paginator/base-paginator.component';
import { CustomPaginatorModule } from '../custom-paginator.module';

@Component({
  selector: 'app-client-paginator',
  standalone: true,
  imports: [CustomPaginatorModule],
  templateUrl: './client-paginator.component.html',
  styleUrl: './client-paginator.component.scss',
  host: {
    role: 'group',
  },
})
export class ClientPaginatorComponent extends BasePaginatorComponent implements OnChanges {
  /**
   * The total data to be paginated.
   * @type {any[]}
   */
  @Input() totalData: any[] = [];

  /**
   * Event emitted with the paginated data.
   * @type {EventEmitter<any[]>}
   */
  @Output() paginatedData = new EventEmitter<any[]>();

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * @param {SimpleChanges} changes - The changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalData']?.currentValue) {
      this.length = changes['totalData'].currentValue.length;
      this.emitPaginatedData();
    }
  }

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
}
