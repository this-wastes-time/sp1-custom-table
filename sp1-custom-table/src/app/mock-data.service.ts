import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable, of } from 'rxjs';

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

  data = Array.from({ length: 100000 }, (_, k) => this.genData(k + 1));

  private genData(pos: number): MockModel {
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
      married: name.charAt(0) === 'P',
      company: COMPANIES[Math.round(Math.random() * (COMPANIES.length - 1))],
    };
  }

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

  /**
   * Mimicks a backend request for data.
   * @param page 
   * @param pageSize 
   * @param sortBy 
   * @param sortDirection 
   * @param globalFilter 
   * @param filters 
   * @returns An Observable of MockResponse.
   */
  fetchData(
    page: number,
    pageSize: number,
    sortBy?: keyof MockModel,
    sortDirection?: SortDirection,
    globalFilter?: string,
    filters?: Record<string, any>
  ): Observable<MockResponse> {
    let filteredData = [...this.data];

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
            // const startDate = start ? new Date(filterValue.start).getTime() : -Infinity;
            // const endDate = end ? new Date(filterValue.end).getTime() : -Infinity;
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
    const totalCount = filteredData.length;

    // Sort if sortBy is provided
    if (sortBy) {
      const direction = sortDirection === 'desc' ? -1 : 1; // Default to 'asc' if undefined
      filteredData.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

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
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    // Return the data as an Observable<MockResponse>
    return of({
      items: paginatedData,
      count: totalCount,
    });
  }

  /**
   * Returns all the data the "server" has.
   * @returns 
   */
  async fetchAll(): Promise<MockModel[]> {
    return Promise.resolve(this.data);
  }
}
