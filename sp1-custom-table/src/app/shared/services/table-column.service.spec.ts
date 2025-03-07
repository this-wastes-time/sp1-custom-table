import { TestBed } from '@angular/core/testing';
import { TableColumnService } from './table-column.service';
import { Column } from '../components/table/models/column.model';

describe('TableColumnService', () => {
  let service: TableColumnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableColumnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should flatten a simple object into columns', () => {
    const obj = {
      id: 1,
      name: 'John Doe',
    };

    const determineColumnType = (key: string, _value: any, path: string): Column<any> => ({
      type: 'text',
      field: path,
      header: key,
      sortable: true,
      visible: true,
    });

    const columns = service.flattenObjectToColumns(obj, determineColumnType);

    expect(columns).toEqual([
      { type: 'text', field: 'id', header: 'id', sortable: true, visible: true },
      { type: 'text', field: 'name', header: 'name', sortable: true, visible: true },
    ]);
  });

  it('should flatten a nested object into columns with dot notation', () => {
    const obj = {
      id: 1,
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
      },
    };

    const determineColumnType = (key: string, value: any, path: string): Column<any> => ({
      type: 'text',
      field: path,
      header: key,
      sortable: true,
      visible: true,
    });

    const columns = service.flattenObjectToColumns(obj, determineColumnType);

    expect(columns).toEqual([
      { type: 'text', field: 'id', header: 'id', sortable: true, visible: true },
      { type: 'text', field: 'name', header: 'name', sortable: true, visible: true },
      { type: 'text', field: 'address.street', header: 'street', sortable: true, visible: true },
      { type: 'text', field: 'address.city', header: 'city', sortable: true, visible: true },
    ]);
  });

  it('should merge new columns with existing columns', () => {
    const existingColumns: Column<any>[] = [
      {
        type: 'text',
        field: 'id',
        header: 'ID',
        sortable: true,
        visible: true,
      },
    ];

    const obj = {
      name: 'John Doe',
      address: {
        city: 'Anytown',
      },
    };

    const determineColumnType = (key: string, value: any, path: string): Column<any> => ({
      type: 'text',
      field: path,
      header: key,
      sortable: true,
      visible: true,
    });

    const mergedColumns = service.flattenAndMergeColumns(obj, determineColumnType, existingColumns);

    expect(mergedColumns).toEqual([
      { type: 'text', field: 'id', header: 'ID', sortable: true, visible: true },
      { type: 'text', field: 'name', header: 'name', sortable: true, visible: true },
      { type: 'text', field: 'address.city', header: 'city', sortable: true, visible: true },
    ]);
  });

  it('should return an empty array for an empty object', () => {
    const obj = {};

    const determineColumnType = (key: string, value: any, path: string): Column<any> => ({
      type: 'text',
      field: path,
      header: key,
      sortable: true,
      visible: true,
    });

    const columns = service.flattenObjectToColumns(obj, determineColumnType);

    expect(columns).toEqual([]);
  });

  it('should handle invalid fields gracefully', () => {
    const obj = {
      id: 1,
      name: 'John Doe',
    };

    const determineColumnType = (key: string, value: any, path: string): Column<any> => ({
      type: 'text',
      field: path,
      header: key,
      sortable: true,
      visible: true,
    });

    const columns = service.flattenObjectToColumns(obj, determineColumnType);

    // Attempt to access a non-existent field
    const invalidField = columns.find((col) => col.field === 'invalid');
    expect(invalidField).toBeUndefined();
  });
});