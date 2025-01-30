import { Component, OnInit } from '@angular/core';
import { Table } from './shared/components/custom-table/models/table.model';
import { CustomTableComponent } from './shared/components/custom-table/custom-table.component';
import { MockDataService, MockModel } from './mock-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  tableConfig: Table = {
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
          }
        },
        {
          field: 'weight',
          header: 'Weight',
          sortable: true,
          filterOptions: {
            type: 'text',
            label: 'Filter Weight (>=)',
            filterPredicate: (row: any, filter: string) => {
              const filterNumber = parseInt(filter, 10);
              return row.weight >= filterNumber; // Example: Show rows where weight is greater than or equal to the filter
            },
          }
        },
        {
          field: 'symbol',
          header: 'Symbol',
          sortable: true,
          filterOptions: {
            type: 'select',
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
          }
        },
        {
          field: 'company',
          header: 'Company',
          sortable: true,
          filterOptions: {
            type: 'select',
          }
        },
      ],
      stickyHeaders: true,
    },
    // showRowNumbers: true,
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
      instantSearch: true,
    },
    pagination: {
      accessibleLabel: 'custom paginator label',
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 50, 100],
      showFirstLast: true,
    }
  };

  data!: MockModel[];

  constructor(
    private mockService: MockDataService,
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
  }

  protected printFilters(filters: Record<string, string>): void {
    console.log('Filters:', filters);
  }
}
