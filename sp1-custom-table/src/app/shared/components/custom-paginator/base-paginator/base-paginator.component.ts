import { booleanAttribute, ChangeDetectorRef, Component, EventEmitter, inject, Input, numberAttribute, Output } from '@angular/core';
import { CustomPaginatorModule } from '../custom-paginator.module';
import { MatPaginatorIntl } from '@angular/material/paginator';

const DEFAULT_PAGE_SIZE = 10;

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CustomPaginatorModule],
  template: ``,
})
export abstract class BasePaginatorComponent {

  @Input({ transform: numberAttribute })
  get pageIndex(): number {
    return this._pageIndex;
  }
  set pageIndex(value: number) {
    this._pageIndex = Math.max(value || 0, 0);
    this.detector.markForCheck();
  }
  private _pageIndex = 0;

  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  @Input({ transform: numberAttribute })
  get length(): number {
    return this._length;
  }
  set length(value: number) {
    this._length = value || 0;
    this.detector.markForCheck();
  }
  private _length = 0;

  /** Number of items to display on a page. By default set to 10. */
  @Input({ transform: numberAttribute })
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    this._pageSize = Math.max(value || 0, 0);
    this._updatePageSizeOptions();
  }
  private _pageSize!: number;

  /** The set of provided page size options to display to the user. */
  @Input()
  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }
  set pageSizeOptions(value: number[] | readonly number[]) {
    this._pageSizeOptions = (value || ([] as number[])).map(p => numberAttribute(p, 0));
    this._updatePageSizeOptions();
  }
  private _pageSizeOptions: number[] = [];

  @Input({ required: true })
  get accessibleLabel(): string {
    return this._accessibleLabel;
  }
  set accessibleLabel(value: string) {
    this._accessibleLabel = value;
  }
  private _accessibleLabel!: string;

  /** Whether to hide the page size selection UI from the user. */
  @Input({ transform: booleanAttribute })
  hidePageSize = false;

  /** Whether to show the first/last buttons UI to the user. */
  @Input({ transform: booleanAttribute })
  showFirstLastButtons = false;

  /** Whether the paginator is disabled. */
  @Input({ transform: booleanAttribute })
  disabled = false;

  /** Event emitted when the paginator changes the page size or page index. */
  @Output() readonly page: EventEmitter<number> = new EventEmitter<number>();

  readonly paginatorIntl = inject(MatPaginatorIntl);
  protected _displayedPageSizeOptions!: number[];

  // Tooltips.
  firstPageTooltip = 'First page';
  previousPageTooltip = 'Previous page';
  nextPageTooltip = 'Next page';
  lastPageTooltip = 'Last page';

  constructor(
    private detector: ChangeDetectorRef,
  ) { }

  protected onPageSizeChange(newPageSize: number): void {
    // Go to first page.
    this.pageIndex = 0;
    this.pageSize = newPageSize;
  }

  protected get totalPages(): number {
    return Math.ceil(this.length / this.pageSize) || 0;
  }

  protected paginate(targetPage: number): void {
    this.pageIndex = targetPage;
    this.page.emit(this.pageIndex);
  }

  protected hasPrev(): boolean {
    return this.pageIndex <= 0;
  }

  protected hasNext(): boolean {
    return this.pageIndex >= (this.totalPages - 1);
  }

  protected abstract emitPaginatedData(): void;

  private _updatePageSizeOptions() {
    // If no page size is provided, use the first page size option or the default page size.
    if (!this.pageSize) {
      this._pageSize =
        this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
    }

    this._displayedPageSizeOptions = this.pageSizeOptions.slice();

    if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
      this._displayedPageSizeOptions.push(this.pageSize);
    }

    // Sort the numbers using a number-specific sort function.
    this._displayedPageSizeOptions.sort((a, b) => a - b);
    this.detector.markForCheck();
  }

}
