import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BasePaginatorComponent } from '../base-paginator/base-paginator.component';
import { CustomPaginatorModule } from '../custom-paginator.module';

@Component({
  selector: 'app-server-paginator',
  standalone: true,
  imports: [CustomPaginatorModule],
  templateUrl: './server-paginator.component.html',
  styleUrl: './server-paginator.component.scss'
})
export class ServerPaginatorComponent extends BasePaginatorComponent implements OnChanges {
  @Input() data: any[] = [];
  @Output() paginatedData = new EventEmitter<any[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.currentValue) {
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

  protected emitPaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData.emit(this.data.slice(startIndex, endIndex));
  }
}
