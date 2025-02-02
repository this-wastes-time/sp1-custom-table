import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableConfig } from './shared/components/custom-table/models/table.model';
import { CustomTableComponent } from './shared/components/custom-table/custom-table.component';
import { MockDataService, MockModel } from './mock-data.service';
import { ClientPaginatorComponent } from './shared/components/custom-paginator/client-paginator/client-paginator.component';
import { ServerPaginatorComponent } from './shared/components/custom-paginator/server-paginator/server-paginator.component';
import { catchError, finalize, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomTableComponent, ClientPaginatorComponent, ServerPaginatorComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
// export class AppComponent implements OnInit {
export class AppComponent {
  @ViewChild(ClientPaginatorComponent) clientPaginator!: ClientPaginatorComponent;
  @ViewChild(ServerPaginatorComponent) serverPaginator!: ServerPaginatorComponent;

  // Table component configuation.
  tableConfig: TableConfig = {
    id: 'test-table',
    caption: 'User data table with actions.',
    columnsConfig: {
      columns: [
        {
          field: 'position',
          header: 'Position',
        },
        {
          field: 'name',
          header: 'Name',
          sortable: true,
          filterOptions: {
            type: 'select',
            templateInputs: () => ({
              selectValues: () => Array.from(new Set(this.clientData?.map(e => e.name))).sort(),
              multiple: true,
            }),
          }
        },
        {
          field: 'weight',
          header: 'Weight',
          sortable: true,
        },
        {
          field: 'symbol',
          header: 'Symbol',
          sortable: true,
          filterOptions: {
            type: 'select',
            templateInputs: () => ({
              selectValues: () => Array.from(new Set(this.clientData?.map(e => e.symbol))).sort(),
              multiple: true,
            })
          }
        },
        {
          field: 'discoveredBy',
          header: 'Discovered By',
          sortable: true,
          filterOptions: {
            type: 'text',
          }
        },
        {
          field: 'discoveryLocation',
          header: 'Discovery Location',
          valueGetter: (row) => `${row.university} (${row.country})`,
          sortable: true,
        },
        {
          field: 'career',
          header: 'Career',
          sortable: true,
          filterOptions: {
            type: 'select',
            templateInputs: () => ({
              selectValues: () => Array.from(new Set(this.clientData?.map(e => e.career))).sort(),
              multiple: true,
            }),
          }
        },
        {
          field: 'online',
          header: 'Online Graduate',
          cellTemplate: 'checkbox',
          templateInputs: (row) => ({
            checked: row.online,
          }),
          filterOptions: {
            type: 'select',
            templateInputs: () => ({
              selectValues: () => Array.from(new Set(this.clientData?.map(e => e.online))).sort(),
              multiple: true,
            }),
          }
        },
        {
          field: 'dob',
          header: 'Date of Birth',
          sortable: true,
          filterOptions: {
            type: 'dateRange',
          }
        },
        {
          field: 'married',
          header: 'Married',
          sortable: true,
          cellTemplate: 'checkbox',
          templateInputs(row): Record<string, unknown> {
            return { checked: row.married };
          },
          filterOptions: {
            type: 'select',
            templateInputs: () => ({
              selectValues: () => Array.from(new Set(this.clientData?.map(e => e.married))).sort(),
              multiple: true,
            }),
          }
        },
        {
          field: 'company',
          header: 'Company',
          sortable: true,
          filterOptions: {
            type: 'select',
            templateInputs: () => ({
              selectValues: () => Array.from(new Set(this.clientData?.map(e => e.company))).sort(),
              multiple: true,
            }),
          }
        },
      ],
      stickyHeaders: true,
    },
    showRowNumbers: true,
    rowClass: (row) => (row.name === 'Calcium' ? ['gold', 'bold'] : ''),
    sortOptions: {
      sortFunc(item, property) {
        if (property === 'discoveryLocation') {
          return `${item.university} ${item.country}`;
        }
        return item[property];
      },
    },
    tableActions: [
      {
        label: 'Delete rows',
        description: 'Delete selected rows',
        action: (rows?: any[]) => rows?.map((row) => console.log('Deleting:', row)),
        disabled: (rows?: any[]) => !rows || rows.length === 0,
      },
      {
        label: 'Export rows',
        description: 'Export selected rows',
        action: () => console.log('Exporting selected rows'),
        disabled: (rows?: any[]) => !rows || rows.length === 0,
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
    filterOptions: {
      id: 'table-filter',
      label: 'Filter entire table',
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
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [10, 15, 20, 25];
  showFirstLast = true;

  // Loading spinner var.
  loading!: boolean;

  constructor(
    private mockService: MockDataService,
    private detector: ChangeDetectorRef,
  ) {
    this.loading = true;
    // Server side pagination test.
    setTimeout(() => {
      this.serverData$ = this.mockService.fetchData(this.pageIndex, this.pageSize).pipe(
        catchError(() => {
          return of([]); // Return an empty array in case of error
        }),
        finalize(() => {
          this.loading = false;
          detector.detectChanges();
        })
      );
    }, 2500);
  }

  // async ngOnInit(): Promise<void> {
  //   // Client side pagination start.
  //   await this.loadData();
  // }

  async loadData(): Promise<void> {
    // Client side pagination test.
    this.clientData = await this.mockService.fetchAll();
    this.filteredData = this.clientData;
  }

  protected updateDataClient(newData: MockModel[]): void {
    this.paginatedData = [...newData];
    this.pageIndex = this.clientPaginator.pageIndex;
    this.pageSize = this.clientPaginator.pageSize;
    this.detector.detectChanges();
  }

  protected updateDataServer(): void {
    this.loading = true;
    this.pageIndex = this.serverPaginator.pageIndex;
    this.pageSize = this.serverPaginator.pageSize;

    this.serverData$ = this.mockService.fetchData(this.pageIndex, this.pageSize).pipe(
      catchError(() => {
        return of([]); // Return an empty array in case of error
      }),
      finalize(() => {
        this.loading = false;
      })
    );
  }

  protected tableDataRequestClient(tableState: Record<string, any>): void {
    let filteredData = [...this.clientData];

    // Store filtering and sorting options.
    const globalFilter = tableState['globalFilter'];
    const columnFilters = tableState['columnFilters'];
    const sortBy = tableState['sortBy'];
    const sortDirection = tableState['sortDirection'];

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

    // Apply filters, if provided
    if (columnFilters) {
      Object.keys(columnFilters).forEach((key) => {
        const filterValue = columnFilters[key];
        filteredData = filteredData.filter((item) => {
          const itemValue = item[key as keyof MockModel];

          // Handle range filter (e.g., "dob")
          if (filterValue?.start || filterValue?.end) {
            const { start, end } = filterValue;
            const itemDate = new Date(itemValue as string).getTime();
            return (
              // Check if itemDate is >= start (if start exists)
              (!start || itemDate >= start) &&
              // Check if itemDate is <= end (if end exists)
              (!end || itemDate <= end)
            );
          }

          // Handle multiple values filtering (e.g., "name": ["Aluminum", "Beryllium"])
          if (Array.isArray(filterValue)) {
            return filterValue.includes(itemValue);
          }

          // Handle string matching (case-insensitive)
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(String(filterValue).toLowerCase());
          }

          // Handle direct equality checks for booleans and numbers
          const filterPred = this.tableConfig.columnsConfig.columns.find(c => c.field === key)?.filterOptions?.filterPredicate;
          return filterPred ? filterPred(item, filterValue) : itemValue === filterValue;
        });
      });
    }

    // Sort if sortBy is provided
    if (sortBy) {
      const direction = sortDirection === 'desc' ? -1 : sortDirection === 'asc' ? 1 : 0;
      filteredData.sort((a, b) => {
        const aValue = a[sortBy as keyof MockModel];
        const bValue = b[sortBy as keyof MockModel];

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

    this.filteredData = filteredData;
  }

  protected tableDataRequestServer(tableState: Record<string, any>): void {

    this.loading = true;

    // Store filtering and sorting options.
    const globalFilter = tableState['globalFilter'];
    const columnFilters = tableState['columnFilters'];
    const sortBy = tableState['sortBy'];
    const sortDirection = tableState['sortDirection'];

    this.serverData$ = this.mockService.fetchData(this.pageIndex, this.pageSize, sortBy, sortDirection, globalFilter, columnFilters).pipe(
      catchError(() => {
        return of([]); // Return an empty array in case of error
      }),
      finalize(() => {
        this.loading = false;
      })
    );
  }
}
