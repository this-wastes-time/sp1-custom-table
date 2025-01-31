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
  @Input() totalData: any[] = [];
  @Output() paginatedData = new EventEmitter<any[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalData'].currentValue) {
      this.length = changes['totalData'].currentValue.length;
      this.emitPaginatedData();
    }
  }

  override paginate(page: number): void {
    super.paginate(page);
    this.emitPaginatedData();
  }

  protected override onPageSizeChange(newPageSize: number): void {
    super.onPageSizeChange(newPageSize);
    this.emitPaginatedData();
  }

  private emitPaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData.emit(this.totalData.slice(startIndex, endIndex));
  }
}
