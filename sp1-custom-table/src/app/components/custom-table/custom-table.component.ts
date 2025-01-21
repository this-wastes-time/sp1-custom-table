import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CustomTableModule } from './custom-table.module';
import { BehaviorSubject, Observable } from 'rxjs';
import { Table } from './models/table.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

  // Table data vars.
  // private dataSubject = new BehaviorSubject<any[]>([]);
  // dataSource$: Observable<any[]> = this.dataSubject.asObservable();
  dataSource = new MatTableDataSource<any>(); // MatTableDataSource instance

  // Table column vars.
  displayColumns: string[] = [];
  rowOffset = 1;

  ngOnChanges(changes: SimpleChanges): void {
    // When a table configuration comes in, set the columns.
    if (changes['tableConfig']) {
      this.generateDisplayColumns();
    }

    // When the data for the table comes in, update the Observable.
    if (changes['tableData']) {
      // const curData = changes['tableData'].currentValue;
      // this.dataSource.data = curData;
      this.dataSource.data = changes['tableData'].currentValue;
    }
    // this.dataSubject.next(curData);
    // this.dataSource$.subscribe(data => {
    //   this.dataSource.data = data;
    // });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

}
