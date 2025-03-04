import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableConfig } from './shared/components/custom-table/models/table.model';
import { CustomTableComponent } from './shared/components/custom-table/custom-table.component';
import { MockDataService, MockModel, COMPOUND_FIELDS } from './mock-data.service';
import { ClientPaginatorComponent } from './shared/components/custom-paginator/client-paginator/client-paginator.component';
import { ServerPaginatorComponent } from './shared/components/custom-paginator/server-paginator/server-paginator.component';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { TableColumnService } from './shared/services/table-column.service';
import { Column } from './shared/components/custom-table/models/column.model';
import { PathValuePipe } from './shared/pipes/path-value.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SpanFillerComponent } from './shared/components/span-filler/span-filler.component';

const AFREFRESH = 2000;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomTableComponent, ClientPaginatorComponent, ServerPaginatorComponent, AsyncPipe, MatDividerModule, MatSlideToggleModule, SpanFillerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [PathValuePipe],
})
export class AppComponent implements OnInit {
  @ViewChild('clientTable') clientTable!: CustomTableComponent<MockModel>;
  @ViewChild('serverTable') serverTable!: CustomTableComponent<MockModel>;
  @ViewChild(ClientPaginatorComponent) clientPaginator!: ClientPaginatorComponent;
  @ViewChild(ServerPaginatorComponent) serverPaginator!: ServerPaginatorComponent;

  // Table component configuation.
  tableConfig: TableConfig<MockModel> = {
    id: 'test-table',
    caption: 'User data table with actions.',
    columnsConfig: {
      columns: [
        {
          type: 'button',
          field: 'position',
          header: 'Position',
          align: 'center',
          label: (row: MockModel) => String(row.position),
          onClick: (row: MockModel) => console.log('Position:', row.position),
          visible: false,
        },
        {
          type: 'text',
          field: 'name',
          header: 'Name',
          sortable: true,
        },
        {
          type: 'text',
          field: 'weight',
          header: 'Weight',
          sortable: true,
          align: 'right',
        },
        {
          type: 'text',
          field: 'symbol',
          header: 'Symbol',
          sortable: true,
        },
        {
          type: 'text',
          field: 'discoveredBy',
          header: 'Discovered By',
          sortable: true,
        },
        {
          type: 'text',
          field: 'discoveryLocation',
          header: 'Discovery Location',
          valueGetter: (row) => `${row.university} (${row.country})`,
          sortable: true,
        },
        {
          type: 'text',
          field: 'career',
          header: 'Career',
          sortable: true,
        },
        {
          type: 'checkbox',
          field: 'online',
          header: 'Online Graduate',
          checked(row) {
            return row.online;
          },
          align: 'center',
        },
        {
          type: 'text',
          field: 'dob',
          header: 'Date of Birth',
          sortable: true,
        },
        {
          type: 'checkbox',
          field: 'married',
          header: 'Married',
          checked(row) {
            return row.married;
          },
          align: 'center',
        },
        {
          type: 'text',
          field: 'company',
          header: 'Company',
          sortable: true,
        },
      ],
      stickyHeaders: true,
      showHideColumns: true,
      reorderColumns: true,
    },
    showRowNumbers: true,
    multiRowSelection: true,
    rowClass: (row: MockModel) => (row.name === 'Calcium' ? ['gold', 'bold'] : ''),
    sortOptions: {
      sortFunc(item, property): string | number {
        if (property === 'discoveryLocation') {
          return `${item.university} ${item.country}`;
        }
        const value = item[property as keyof MockModel];
        if (typeof value === 'boolean') {
          return Number(value);
        } else if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value;
      },
    },
    selectedRowActions: [
      {
        label: 'Delete rows',
        description: 'Delete selected rows',
        action: (rows: MockModel[]) => rows?.forEach((row) => console.log('Deleting:', row)),
      },
      {
        label: 'Export rows',
        description: 'Export selected rows',
        action: () => console.log('Exporting selected rows'),
        disabled: (rows: MockModel[]) => rows?.some(row => row.career === 'Paleontologist'),
      },
    ],
    rowActions: {
      stickyActions: true,
      actions: [
        {
          label: 'Show details',
          description: 'Show more details',
          action: (row) => console.log('Showing details:', row),
        },
      ],
    },
  };

  // Client table config
  clientConfig: TableConfig<MockModel> = {
    ...this.tableConfig,
    autoRefresh: {
      enabled: false,
      intervalMs: AFREFRESH,
      autoRefreshFunc: (afState) => {
        this.toggleAutoRefresh(afState);
      },
    },
    tableActions: [
      {
        label: 'Refresh table',
        description: 'Update table with latest data',
        action: () => {
          this.loadData();
          this.tableDataRequestClient();
        }
      },
    ],
    searchBarConfig: {
      label: 'Search client table',
      placeholder: 'Example: Hydrogen',
    },
  };

  // Server table config
  serverConfig: TableConfig<MockModel> = {
    ...this.tableConfig,
    tableActions: [
      {
        label: 'Refresh table',
        description: 'Update table with latest data',
        action: () => {
          // Author note: It would be considered a best practice to reset the paginator state of whether all items are known upon refresh.
          this.serverPaginator.totalItemsKnown = false;
          this.serverData$ = this.mockService.fetchData(this.sPageIndex, this.sPageSize).pipe(
            catchError(() => {
              return of([]); // Return an empty array in case of error
            }),
            finalize(() => {
              this.loading = false;
              this.detector.detectChanges();
            })
          );
        }
      },
    ],
    searchBarConfig: {
      label: 'Search server table',
      placeholder: 'Example: Hydrogen',
    },
  };

  // Table data.
  clientData!: MockModel[];
  filteredData!: MockModel[];
  paginatedData!: MockModel[];
  serverData$!: Observable<MockModel[]>;

  // Paginator vars.
  accessibleLabel = 'test paginator label';
  showFirstLast = true;

  // Client paging vars.
  cPageIndex = 0;
  cPageSize = 10;
  cPageSizeOptions = [10, 20, 40, 80, 100];

  // Client filter var.
  clientFilter = '';

  // Client sort var.
  clientSort = { active: '', direction: '' };

  // Server paging vars.
  sPageIndex = 0;
  sPageSize = 10;
  sPageSizeOptions = [5, 10, 20, 45, 100];

  // Loading spinner var.
  loading!: boolean;

  // Auto-refresh vars.
  _refreshIntervalId!: ReturnType<typeof setTimeout>;;

  // Example toggle var.
  toggleExample: 'client' | 'server' = 'client';

  constructor(
    private mockService: MockDataService,
    private detector: ChangeDetectorRef,
    private flattenService: TableColumnService,
    private pvp: PathValuePipe,
  ) {
    this.loading = true;
    // Mock server data retrieval wait.
    setTimeout(() => {
      this.serverData$ = this.mockService.fetchData(this.sPageIndex, this.sPageSize).pipe(
        catchError(() => {
          return of([]); // Return an empty array in case of error
        }),
        finalize(() => {
          this.loading = false;
          detector.detectChanges();
        })
      );
    }, this._getRandomNumber(1000, 2500));
  }

  ngOnInit(): void {
    // Client side pagination start.
    this.loadData();

    // Check auto-refresh state.
    if (this.tableConfig.autoRefresh?.enabled) {
      this.startAF();
    }
  }

  loadData(): void {
    // Client side pagination test.
    this.clientData = this.mockService.fetchAll();

    const determineColumnType = (_key: string, value: any, path: string): Column<any> => {
      if (typeof value === 'boolean') {
        return {
          type: 'slideToggle',
          field: path,
          header: this._getFlattenedHeader(path),
          sortable: false,
          align: 'center',
          visible: true,
          checked: (row: any) => this.pvp.transform<typeof row, boolean>(row, path) ?? false,
        };
      }
      return {
        type: 'text',
        field: path,
        header: this._getFlattenedHeader(path),
        sortable: true,
        visible: true,
      };
    };
    // Flatten certain objects in the data to get column properties and merge with existing columns.
    this.tableConfig.columnsConfig.columns = this.flattenService.flattenAndMergeColumns(
      this.clientData[0].preferences,
      determineColumnType,
      this.flattenService.flattenAndMergeColumns(
        this.clientData[0].address,
        determineColumnType,
        this.tableConfig.columnsConfig.columns,
        'address'
      ),
      'preferences'
    );

    this.filteredData = [...this.clientData];
    this.detector.detectChanges();
  }

  updateDataClient(newData: MockModel[]): void {
    this.paginatedData = [...newData];
    if (this.clientPaginator) {
      // Interesting reassignment with destructuring ..
      ({ pageIndex: this.cPageIndex, pageSize: this.cPageSize } = this.clientPaginator.getPagination());
    }
    this.detector.detectChanges();
  }

  updateDataServer(): void {
    this.loading = true;
    ({ pageIndex: this.sPageIndex, pageSize: this.sPageSize } = this.serverPaginator.getPagination());

    setTimeout(() => {
      this.serverData$ = this.mockService.fetchData(this.sPageIndex, this.sPageSize).pipe(
        map(data => {
          if (data.length < this.sPageSize) {
            const count = (this.sPageIndex * this.sPageSize) + data.length;
            this.serverPaginator.totalItems = count;
          }
          return data;
        }),
        catchError(() => {
          return of([]); // Return an empty array in case of error
        }),
        finalize(() => {
          this.loading = false;
          this.detector.detectChanges();
        })
      );
    }, this._getRandomNumber(275, 1000));
  }

  tableDataRequestClient(): void {
    let filteredData = [...this.clientData];

    // Store filtering and sorting options.
    const globalFilter = this.clientFilter;
    const sortBy = this.clientSort.active;
    const sortDirection = this.clientSort.direction;

    // Apply global filter, if provided
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    // Sort if sortBy is provided
    if (sortBy) {
      const direction = sortDirection === 'desc' ? -1 : sortDirection === 'asc' ? 1 : 0;
      filteredData.sort((a, b) => {
        let aValue, bValue;

        // Check if `sortBy` is a compound field
        if (COMPOUND_FIELDS[sortBy]) {
          // Extract the config for the compound field
          const { properties, combiner } = COMPOUND_FIELDS[sortBy];
          // Combine the properties for comparison
          aValue = combiner(...properties.map(prop => a[prop]));
          bValue = combiner(...properties.map(prop => b[prop]));
        } else {
          // Handle single property sorting
          aValue = this.pvp.transform(a, sortBy);
          bValue = this.pvp.transform(b, sortBy);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * direction;
        } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return (Number(aValue) - Number(bValue)) * direction;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * direction;
        }
        return 0;
      });
    }

    this.filteredData = [...filteredData];

    // If user was beyond current allowable page range, move them to the last available page.
    const lastPage = Math.ceil(this.filteredData.length / this.clientPaginator.pageSize);
    const validatedPage = Math.min(this.clientPaginator.pageIndex, lastPage - 1);
    this.clientPaginator.pageIndex = validatedPage;
  }

  tableDataRequestServer(): void {

    this.loading = true;
    // Reset if paginator knows the data limit.
    this.serverPaginator.totalItemsKnown = false;
    // const filters = this.serverTable.getFilters();
    const sort = this.serverTable as any; // LOL Please don't do this in production code.

    // Store filtering and sorting options.
    const globalFilter = '';
    const sortBy = sort?.active;
    const sortDirection = sort?.direction;

    setTimeout(() => {
      this.serverData$ = this.mockService.fetchData(this.sPageIndex, this.sPageSize, sortBy, sortDirection, globalFilter).pipe(
        catchError(() => {
          return of([]); // Return an empty array in case of error
        }),
        finalize(() => {
          this.loading = false;
          this.detector.detectChanges();
        })
      );
    }, this._getRandomNumber(275, 1000));
  }

  toggleAutoRefresh(enabled: boolean): void {
    if (enabled) {
      this.stopAF();
    } else {
      this.startAF();
    }
  }

  startAF(): void {
    this._refreshIntervalId = setInterval(() => {
      this.loadData();
      this.tableDataRequestClient();
    }, this.tableConfig.autoRefresh?.intervalMs);
  }

  stopAF(): void {
    clearInterval(this._refreshIntervalId);
  }

  clientFilterChanged(updatedFilter: string): void {
    this.clientFilter = updatedFilter;
    this.tableDataRequestClient();
  }

  clientSortChanged(updatedSort: { active: string; direction: string }): void {
    this.clientSort = updatedSort;
    this.tableDataRequestClient();
  }

  onToggleChange(checked: boolean): void {
    this.toggleExample = checked ? 'server' : 'client';
  }

  _getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _getFlattenedHeader(path: string): string {
    const parts = path.split('.').map<string>(str => str.charAt(0).toUpperCase() + str.slice(1));
    if (parts.length === 1) {
      return parts[0];
    }

    const prefix = parts.slice(0, parts.length - 1).join(' ');
    const field = parts[parts.length - 1];
    return `[${prefix}] ${field}`;
  }
}
