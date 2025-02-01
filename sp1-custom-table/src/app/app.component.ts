import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableConfig } from './shared/components/custom-table/models/table.model';
import { CustomTableComponent } from './shared/components/custom-table/custom-table.component';
import { MockDataService, MockModel } from './mock-data.service';
import { ClientPaginatorComponent } from './shared/components/custom-paginator/client-paginator/client-paginator.component';
import { ColumnsConfig } from './shared/components/custom-table/models/column.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomTableComponent, ClientPaginatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  tableConfig: TableConfig = {
    id: 'test-table',
    caption: 'User data table with actions.'
  };

  columnsConfig: ColumnsConfig = {
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
          selectValues: () => Array.from(new Set(this.filteredData?.map(e => e.name))).sort(),
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
          selectValues: () => Array.from(new Set(this.filteredData?.map(e => e.symbol))).sort(),
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
          selectValues: () => Array.from(new Set(this.filteredData?.map(e => e.career))).sort(),
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
          selectValues: () => Array.from(new Set(this.filteredData?.map(e => e.online))).sort(),
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
          selectValues: () => Array.from(new Set(this.filteredData?.map(e => e.married))).sort(),
        }
      },
      {
        field: 'company',
        header: 'Company',
        sortable: true,
        filterOptions: {
          type: 'select',
          selectValues: () => Array.from(new Set(this.filteredData?.map(e => e.company))).sort(),
        }
      },
    ],
    stickyHeaders: true,
  };

  // Table data.
  data!: MockModel[];
  filteredData!: MockModel[];
  paginatedData!: MockModel[];

  // Paginator vars.
  accessibleLabel = 'test paginator label';
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [10, 15, 20, 25];
  showFirstLast = true;

  constructor(
    private mockService: MockDataService,
    private detector: ChangeDetectorRef,
  ) {
    // Server side pagination test.
    // mockService.fetchData(1, 11)
    //   .pipe().subscribe(fetchedData => this.data = fetchedData.items);
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    // Client side pagination test.
    this.data = await this.mockService.fetchAll();
    this.filteredData = this.data;
  }

  protected updateData(newData: MockModel[]): void {
    this.paginatedData = [...newData];
    this.detector.detectChanges();
  }

  protected tableDataRequest(tableState: Record<string, any>): void {
    let filteredData = [...this.data];

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
          const filterPred = this.columnsConfig.columns.find(c => c.field === key)?.filterOptions?.filterPredicate;
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
}
