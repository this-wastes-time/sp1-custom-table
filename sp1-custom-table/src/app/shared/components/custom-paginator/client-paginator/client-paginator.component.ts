import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasePaginatorComponent } from '../base-paginator/base-paginator.component';

@Component({
  selector: 'app-client-paginator',
  standalone: true,
  imports: [],
  templateUrl: './client-paginator.component.html',
  styleUrl: './client-paginator.component.scss'
})
export class ClientPaginatorComponent extends BasePaginatorComponent {
  @Input() data: any[] = [];
  @Output() paginatedData = new EventEmitter<any[]>();

  override paginate(page: number): void {
    super.paginate(page);
    this.emitPaginatedData();
  }

  private emitPaginatedData(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData.emit(this.data.slice(startIndex, endIndex));
  }
}
