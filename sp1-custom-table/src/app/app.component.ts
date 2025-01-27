import { Component } from '@angular/core';
import { Table } from './shared/components/custom-table/models/table.model';
import { CustomTableComponent } from './shared/components/custom-table/custom-table.component';
import { formatDate } from '@angular/common';

const NAMES = [
  'Hydrogen',
  'Helium',
  'Lithium',
  'Beryllium',
  'Boron',
  'Carbon',
  'Nitrogen',
  'Oxygen',
  'Fluorine',
  'Neon',
  'Sodium',
  'Magnesium',
  'Aluminum',
  'Silicon',
  'Phosphorus',
  'Sulfur',
  'Chlorine',
  'Argon',
  'Potassium',
  'Calcium',
];

const WEIGHTS = [
  1.0079,
  4.0026,
  6.941,
  9.0122,
  10.811,
  12.0107,
  14.0067,
  15.9994,
  18.9984,
  20.1797,
  22.9897,
  24.305,
  26.9815,
  28.0855,
  30.9738,
  32.065,
  35.453,
  39.948,
  39.0983,
  40.078,
];

const UNIVERSITIES = [
  'Harvard University',
  'Stanford University',
  'University of Cambridge',
  'University of Oxford',
  'Massachusetts Institute of Technology (MIT)',
  'California Institute of Technology (Caltech)',
  'University of Tokyo',
  'University of Melbourne',
  'National University of Singapore (NUS)',
  'ETH Zurich – Swiss Federal Institute of Technology',
  'Tsinghua University',
  'University of Toronto',
  'University of Cape Town',
  'University of São Paulo',
  'Australian National University (ANU)',
  'Seoul National University',
  'Peking University',
  'University of Edinburgh',
  'University of California, Berkeley (UC Berkeley)',
  'Sorbonne University',
];

const COUNTIRES = [
  'USA',
  'UK',
  'Japan',
  'Australia',
  'Singapore',
  'Switzerland',
  'China',
  'Canada',
  'South Africa',
  'Brazil',
  'South Korea',
  'France',
];

const DISCOVERERS = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Davis',
  'Diana Brown',
  'Ethan Wilson',
  'Fiona Miller',
  'George Anderson',
  'Hannah Taylor',
  'Ian Moore',
  'Julia Clark',
];

const CAREERS = [
  'Archaeologist',
  'Paleontologist',
  'Conservation Scientist',
  'Forensic Chemist',
  'Materials Scientist',
  'Analytical Chemist',
  'Geoarchaeologist',
  'Environmental Chemist',
  'Artifact Conservator',
  'Biochemist',
];

const COMPANIES = [
  'Nebula Dynamics',
  'Quantum Horizons Ltd.',
  'Stellar Synergy Co.',
  'Eclipse Innovations',
  'Aurora Nexus',
  'Chronos Technologies',
  'Cosmic Core Enterprises',
  'Lunar Loop Systems',
  'NovaTrail Solutions',
  'FusionSphere Inc.',
];


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
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
            filterable: true,
          }
        },
        {
          field: 'weight',
          header: 'Weight',
          sortable: true,
          filterOptions: {
            type: 'text',
            filterable: true,
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
            filterable: true,
          }
        },
        {
          field: 'discoveredBy',
          header: 'Discovered By',
          sortable: true,
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
            filterable: true,
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
            filterable: true,
          }
        },
        {
          field: 'dob',
          header: 'Date of Birth',
          sortable: true,
          filterOptions: {
            type: 'dateRange',
            filterable: true,
          }
        },
        {
          field: 'married',
          header: 'Married',
          sortable: true,
        },
        {
          field: 'company',
          header: 'Company',
          sortable: true,
          filterOptions: {
            type: 'select',
            filterable: true,
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
      pageSize: 11,
      pageSizeOptions: [11, 25, 50, 100],
    }
  };

  data = Array.from({ length: 100 }, (_, k) => this.genData(k + 1));

  private genData(pos: number): any {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))];

    return {
      position: pos,
      name: name,
      weight: WEIGHTS[Math.round(Math.random() * (WEIGHTS.length - 1))],
      symbol: name.charAt(0),
      university: UNIVERSITIES[Math.round(Math.random() * (UNIVERSITIES.length - 1))],
      country: COUNTIRES[Math.round(Math.random() * (COUNTIRES.length - 1))],
      discoveredBy: DISCOVERERS[Math.round(Math.random() * (DISCOVERERS.length - 1))],
      career: CAREERS[Math.round(Math.random() * (CAREERS.length - 1))],
      online: pos % 4 === 0,
      dob: this.generateRandomDateBetween1940AndToday(),
      married: name.charAt(0) === 'P' ? 'Yes' : 'No',
      company: COMPANIES[Math.round(Math.random() * (COMPANIES.length - 1))],
    };
  }

  // private getRandomDate(startDate: Date, endDate: Date): Date {
  private getRandomDate(startDate: Date, endDate: Date): Date {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const randomTime = Math.random() * (endTime - startTime) + startTime;
    return new Date(randomTime);
  }

  private generateRandomDateBetween1940AndToday(): string {
    const startDate = new Date('2025-01-02');
    const endDate = new Date(); // Today's date
    return formatDate(this.getRandomDate(startDate, endDate), 'MM/dd/yyyy', 'en-US');
  }

  protected printFilters(filters: Record<string, string>): void {
    console.log('Filters:', filters);
  }
}
