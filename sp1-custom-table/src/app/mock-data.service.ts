import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Configuration for a compound field.
 */
interface CompoundFieldConfig {
  /**
   * The properties that make up the compound field.
   */
  properties: (keyof MockModel)[];

  /**
   * Function to combine the properties.
   * @param args The values of the properties.
   * @returns The combined value.
   */
  combiner: (...args: any[]) => string | number;
}

/**
 * Record of compound fields and their configurations.
 */
export const COMPOUND_FIELDS: Record<string, CompoundFieldConfig> = {
  discoveryLocation: {
    properties: ['university', 'country'],
    combiner: (university: string, country: string) => `${university} - ${country}`,
  },
  // Add future compound fields here (no code changes needed beyond this config)
};

export interface MockModel {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  university: string;
  country: string;
  discoveredBy: string;
  career: string;
  online: boolean;
  dob: string;
  married: boolean;
  company: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: {
      email: boolean;
      pager: boolean;
    };
  };
}

export interface MockResponse {
  items: MockModel[];
  count: number;
}

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

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  clientData = Array.from({ length: 1000 }, (_, k) => this.genData(k + 1));
  serverData = Array.from({ length: 500 }, (_, k) => this.genData(k + 1));

  /**
   * Mimicks a backend request for data.
   * @param page The page number to fetch.
   * @param pageSize The number of items per page.
   * @param sortBy The field to sort by.
   * @param sortDirection The direction to sort (asc or desc).
   * @param globalFilter A global filter string to apply to all fields.
   * @param filters Specific filters to apply to individual fields.
   * @returns An Observable of MockResponse.
   */
  fetchData(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: string,
    globalFilter?: string,
    filters?: Record<string, any>
  ): Observable<MockModel[]> {
    let filteredData = [...this.serverData];

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
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const filterValue = filters[key];
        filteredData = filteredData.filter((item) => {
          const itemValue = item[key as keyof MockModel];

          // Handle range filter (e.g., "dob")
          if (filterValue?.start || filterValue?.end) {
            const { start, end } = filterValue || {};
            const itemDate = new Date(itemValue as string).getTime();
            const startDate = start ?? -Infinity;
            const endDate = end ?? -Infinity;
            return itemDate >= startDate && itemDate <= endDate;
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
          return itemValue === filterValue;
        });
      });
    }

    // Store total count before pagination
    // const totalCount = filteredData.length;

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

    // Paginate data
    const startIndex = page * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    // Mock random length (0-50) new data being added at random times (0-10s)
    if (startIndex + pageSize > this.serverData.length) {
      setTimeout(() => {
        this._extendDataset(this.serverData, Math.ceil(Math.random() * 50));
      }, Math.floor(Math.random() * 10001));
    }

    // Return the data as an Observable<MockResponse>
    // return of({
    //   items: paginatedData,
    //   count: totalCount,
    // });
    return of(paginatedData);
  }

  /**
   * Returns all the data the "server" has.
   * @returns An array of MockModel.
   */
  fetchAll(): MockModel[] {
    // Add data to client data array
    setTimeout(() => {
      this._extendDataset(this.clientData, this._getRandomNumber(15, 25));
    }, this._getRandomNumber(0, 1000));
    return this.clientData;
  }

  /**
   * Generates a single MockModel data entry.
   * @param index The index to use for generating the data.
   * @returns A MockModel object.
   */
  private genData(index: number): MockModel {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))];

    return {
      position: (index * 55) % 17,
      name: name,
      weight: WEIGHTS[Math.round(Math.random() * (WEIGHTS.length - 1))],
      symbol: name.charAt(0),
      university: UNIVERSITIES[Math.round(Math.random() * (UNIVERSITIES.length - 1))],
      country: COUNTIRES[Math.round(Math.random() * (COUNTIRES.length - 1))],
      discoveredBy: DISCOVERERS[Math.round(Math.random() * (DISCOVERERS.length - 1))],
      career: CAREERS[Math.round(Math.random() * (CAREERS.length - 1))],
      online: index % 4 === 0,
      dob: this.generateRandomDateBetween1940AndToday(),
      married: name.charAt(0) === 'P',
      company: COMPANIES[Math.round(Math.random() * (COMPANIES.length - 1))],
      address: {
        street: index % 4 ? '123 Main St' : '456 Elm Streat',
        city: index % 4 ? 'Anytown' : 'Hereville',
        zip: index % 4 ? '12345' : '78910',
      },
      preferences: {
        newsletter: true,
        notifications: {
          email: index % 3 === 0,
          pager: index % 2 === 0,
        },
      },
    };
  }

  /**
   * Generates a random date between two given dates.
   * @param startDate The start date.
   * @param endDate The end date.
   * @returns A random Date object.
   */
  private getRandomDate(startDate: Date, endDate: Date): Date {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const randomTime = Math.random() * (endTime - startTime) + startTime;
    return new Date(randomTime);
  }

  /**
   * Generates a random date string between 1940 and today.
   * @returns A formatted date string.
   */
  private generateRandomDateBetween1940AndToday(): string {
    const startDate = new Date('2025-01-02');
    const endDate = new Date(); // Today's date
    return formatDate(this.getRandomDate(startDate, endDate), 'MM/dd/yyyy', 'en-US');
  }

  /**
   * Extends the dataset with new data entries.
   * @param dataset The dataset to extend.
   * @param newLength The number of new entries to add.
   */
  private _extendDataset(dataset: MockModel[], newLength: number): void {
    const newData = Array.from({ length: newLength }, (_, k) => this.genData(k + 1));
    dataset.push(...newData);
  }

  /**
   * Generates a random number between a given range.
   * @param min The minimum value.
   * @param max The maximum value.
   * @returns A random number between min and max.
   */
  private _getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
