import { Component } from '@angular/core';
import { Table } from './components/custom-table/models/table.model';
import { CustomTableComponent } from './components/custom-table/custom-table.component';

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
    columns: [
      { field: 'position', header: 'Position', },
      { field: 'name', header: 'Name', },
      { field: 'weight', header: 'Weight', },
      { field: 'symbol', header: 'Symbol', },
      { field: 'discoverer', header: 'Discovered By', },
      { field: 'discoveredLocation', header: 'Discovery Location', valueGetter: (row) => `${row.university} (${row.country})`, },
      { field: 'career', header: 'Career', },
      { field: 'online', header: 'Online Graduate', },
      { field: 'age', header: 'Age', },
      { field: 'married', header: 'Married', },
      { field: 'company', header: 'Compnay', },
    ],
    numberedRows: true,
    rowClass: (row) => (row.name === 'Calcium' ? ['gold', 'bold'] : ''),
    stickyHeaders: true,
    rowActions: [
      { label: 'Edit', description: 'Edit row action', action: (row) => console.log('Edit:', row), disabled: (row) => (row.name === 'Calcium'), },
      { label: 'Delete', description: 'Delete row action', action: (row) => console.log('Delete:', row), },
    ],
    stickyActions: true,
    pagination: {
      accessibleLabel: 'custom paginator label',
      pageSize: 11,
      pageSizeOptions: [11, 25, 50, 100],
    }
  };

  data = Array.from({ length: 100 }, (_, k) => this.genData(k + 1));
  // data = [];

  genData(pos: number): any {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))];

    return {
      position: pos,
      name: name,
      weight: WEIGHTS[Math.round(Math.random() * (WEIGHTS.length - 1))],
      symbol: name.charAt(0),
      university: UNIVERSITIES[Math.round(Math.random() * (UNIVERSITIES.length - 1))],
      country: COUNTIRES[Math.round(Math.random() * (COUNTIRES.length - 1))],
      discoverer: DISCOVERERS[Math.round(Math.random() * (DISCOVERERS.length - 1))],
      career: CAREERS[Math.round(Math.random() * (CAREERS.length - 1))],
      online: pos % 7 === 0,
      age: 71,
      married: name.charAt(0) === 'P',
      company: COMPANIES[Math.round(Math.random() * (COMPANIES.length - 1))],
    };
  }
}
