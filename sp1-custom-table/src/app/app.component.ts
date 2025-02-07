import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableConfig } from './shared/components/custom-table/models/table.model';
import { CustomTableComponent } from './shared/components/custom-table/custom-table.component';
import { MockDataService, MockModel, COMPOUND_FIELDS } from './mock-data.service';
import { ClientPaginatorComponent } from './shared/components/custom-paginator/client-paginator/client-paginator.component';
import { ServerPaginatorComponent } from './shared/components/custom-paginator/server-paginator/server-paginator.component';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomTableComponent, ClientPaginatorComponent, ServerPaginatorComponent, AsyncPipe, MatDividerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('clientTable') clientTable!: CustomTableComponent;
  @ViewChild('serverTable') serverTable!: CustomTableComponent;
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
        label: 'Refresh table',
        description: 'Update tabe with latest data',
        action: () => {
          this.loadData();
          this.tableDataRequestClient();
        }
      },
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
  showFirstLast = true;

  // Client paging vars.
  cPageIndex = 0;
  cPageSize = 10;
  cPageSizeOptions = [10, 20, 40, 80, 100];

  // Server paging vars.
  sPageIndex = 0;
  sPageSize = 10;
  sPageSizeOptions = [5, 10, 20, 45, 100];

  // Loading spinner var.
  loading!: boolean;

  constructor(
    private mockService: MockDataService,
    private detector: ChangeDetectorRef,
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
  }

  loadData(): void {
    // Client side pagination test.
    this.clientData = this.mockService.fetchAll();
    this.filteredData = [...this.clientData];
    this.detector.detectChanges();
  }

  protected updateDataClient(newData: MockModel[]): void {
    this.paginatedData = [...newData];
    if (this.clientPaginator) {
      // Interesting reassignment with destructuring ..
      ({ pageIndex: this.cPageIndex, pageSize: this.cPageSize } = this.clientPaginator.getPagination());
    }
    this.detector.detectChanges();
  }

  protected updateDataServer(): void {
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

  protected tableDataRequestClient(): void {
    let filteredData = [...this.clientData];
    const filters = this.clientTable.getFilters();
    const sort = this.clientTable.getSort();

    // Store filtering and sorting options.
    const globalFilter = filters?.globalFilter;
    const columnFilters = filters?.columnFilters;
    const sortBy = sort?.active;
    const sortDirection = sort?.direction;

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
          aValue = a[sortBy as keyof MockModel];
          bValue = b[sortBy as keyof MockModel];
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

  protected tableDataRequestServer(): void {

    this.loading = true;
    // Reset if paginator knows the data limit.
    this.serverPaginator.totalItemsKnown = false;
    const filters = this.serverTable.getFilters();
    const sort = this.serverTable.getSort();

    // Store filtering and sorting options.
    const globalFilter = filters?.globalFilter;
    const columnFilters = filters?.columnFilters;
    const sortBy = sort?.active;
    const sortDirection = sort?.direction;

    setTimeout(() => {
      this.serverData$ = this.mockService.fetchData(this.sPageIndex, this.sPageSize, sortBy, sortDirection, globalFilter, columnFilters).pipe(
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

  private _getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
