import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CustomTableModule } from './custom-table.module';
import { Table } from './models/table.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CustomTableModule,],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss'
})
export class CustomTableComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) tableConfig!: Table;
  @Input({ required: true }) tableData!: any[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table data vars.
  dataSource = new MatTableDataSource<any>(); // MatTableDataSource instance

  // Table column vars.
  displayColumns: string[] = [];
  rowOffset = 1;

  constructor(
    private announcer: LiveAnnouncer,
    private detector: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // When a table configuration comes in, set the columns.
    if (changes['tableConfig']?.currentValue) {
      this.generateDisplayColumns();
    }

    // When the data for the table comes in, update the Observable.
    if (changes['tableData']?.currentValue) {
      this.dataSource.data = changes['tableData']?.currentValue ?? this.dataSource.data;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = this.tableConfig.sortOptions?.sortFunc ?? ((data, sortHeaderId) => data[sortHeaderId]);
    this.dataSource.sort = this.sort;
    this.detector.detectChanges();
  }

  private generateDisplayColumns(): void {
    this.displayColumns = this.tableConfig!.columns.map(col => col.field);

    // Include the row number column.
    if (this.tableConfig.numberedRows) {
      this.displayColumns.unshift('#');
    }

    // Include the action column.
    if (this.tableConfig.rowActions) {
      this.displayColumns.push('actions');
    }
  }

  protected sortChange(event: Sort): void {
    const sortDirection = event.direction ? `${event.direction}ending` : 'cleared';
    this.announcer.announce(`Sorting by ${event.active} ${sortDirection}`);
  }

}
