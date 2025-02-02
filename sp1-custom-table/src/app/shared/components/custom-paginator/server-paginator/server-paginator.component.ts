import { Component, EventEmitter, Output } from '@angular/core';
import { BasePaginatorComponent } from '../base-paginator/base-paginator.component';
import { CustomPaginatorModule } from '../custom-paginator.module';
import { ServerPaginatorIntl } from './custom-paginator-intl';
import { MatPaginatorIntl } from '@angular/material/paginator';

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
  providers: [
    { provide: MatPaginatorIntl, useClass: ServerPaginatorIntl },
  ]
})
export class ServerPaginatorComponent extends BasePaginatorComponent {
  @Output() fetchData = new EventEmitter<PaginatorState>();

  override paginate(page: number): void {
    super.paginate(page);
    this.emitPaginatedData();
  }

  protected override onPageSizeChange(newPageSize: number): void {
    super.onPageSizeChange(newPageSize);
    this.emitPaginatedData();
  }

  protected override emitPaginatedData(): void {
    this.fetchData.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
  }
}
