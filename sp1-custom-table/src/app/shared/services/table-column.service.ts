import { Injectable } from '@angular/core';
import { Column } from '../components/table/models/column.model';

@Injectable({
  providedIn: 'root'
})
export class TableColumnService {
  /**
   * Flattens an object into an array of Column objects.
   * @template T - The type of the rows in the table.
   * @param obj - The object to flatten.
   * @param determineColumnType - Callback to determine the column type.
   * @param [prefix=''] - The prefix for nested fields (used internally for recursion).
   * @returns An array of Column objects.
   * @example
   * const nestedObject = { id: 1, name: 'John Doe' };
   * const determineColumnType = (key, value, path) => ({
   *   type: 'text',
   *   field: path,
   *   header: key,
   *   sortable: true,
   *   visible: true,
   * });
   * const columns = flattenObjectToColumns(nestedObject, determineColumnType);
   * console.log(columns);
   */
  flattenObjectToColumns<T>(
    obj: Record<string, any>,
    determineColumnType: (key: string, value: any, path: string) => Column<T>,
    prefix = ''
  ): Column<T>[] {
    const columns: Column<T>[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          // Recursively flatten nested objects
          columns.push(...this.flattenObjectToColumns(obj[key], determineColumnType, fullPath));
        } else {
          // Use the callback to determine the column type
          const column = determineColumnType(key, obj[key], fullPath);
          columns.push(column);
        }
      }
    }

    return columns;
  }

  /**
   * Flattens an object into an array of Column objects and merges them with an existing array of columns.
   * @template T - The type of the rows in the table.
   * @param obj - The object to flatten.
   * @param determineColumnType - Callback to determine the column type.
   * @param [prefix=''] - The prefix for nested fields (used internally for recursion).
   * @param existingColumns - Existing array of Column objects to merge with.
   * @returns A merged array of Column objects.
   * @example
   * // Existing columns
   * const existingColumns = [
   *   {
   *     type: 'button',
   *     field: 'position',
   *     header: 'Position',
   *     align: 'center',
   *     label: (row) => String(row.position),
   *     onClick: (row) => console.log('Position:', row.position),
   *     visible: false,
   *   },
   *   {
   *     type: 'checkbox',
   *     field: 'isActive',
   *     header: 'Active',
   *     sortable: true,
   *     visible: true,
   *     checked: (row) => row.isActive,
   *     onChange: (checked, row) => console.log('Active status changed:', checked, row),
   *   },
   * ];
   *
   * // Example object to flatten
   * const nestedObject = {
   *   id: 1,
   *   name: 'John Doe',
   *   address: {
   *     street: '123 Main St',
   *     city: 'Anytown',
   *     zip: '12345',
   *   },
   *   preferences: {
   *     newsletter: true,
   *     notifications: false,
   *   },
   *   actions: 'Edit', // Example field for a ButtonColumn
   * };
   *
   * // Callback to determine the column type dynamically
   * const determineColumnType = (key, value, path) => {
   *   if (key === 'actions') {
   *     return {
   *       type: 'button',
   *       field: path,
   *       header: key,
   *       sortable: false,
   *       visible: true,
   *       label: (row) => 'Click Me',
   *       onClick: (row) => console.log('Button clicked', row),
   *     };
   *   } else if (typeof value === 'boolean') {
   *     return {
   *       type: 'checkbox',
   *       field: path,
   *       header: key,
   *       sortable: true,
   *       visible: true,
   *       checked: (row) => row[path],
   *       onChange: (checked, row) => console.log('Checkbox changed', checked, row),
   *     };
   *   } else {
   *     return {
   *       type: 'text',
   *       field: path,
   *       header: key,
   *       sortable: true,
   *       visible: true,
   *     };
   *   }
   * };
   *
   * // Flatten the object and merge with existing columns
   * const mergedColumns = flattenAndMergeColumns(nestedObject, determineColumnType, existingColumns);
   * console.log(mergedColumns);
   * // Output:
   * // [
   * //   {
   * //     type: 'button',
   * //     field: 'position',
   * //     header: 'Position',
   * //     align: 'center',
   * //     label: (row) => String(row.position),
   * //     onClick: (row) => console.log('Position:', row.position),
   * //     visible: false,
   * //   },
   * //   {
   * //     type: 'checkbox',
   * //     field: 'isActive',
   * //     header: 'Active',
   * //     sortable: true,
   * //     visible: true,
   * //     checked: (row) => row.isActive,
   * //     onChange: (checked, row) => console.log('Active status changed:', checked, row),
   * //   },
   * //   { type: 'text', field: 'id', header: 'id', sortable: true, visible: true },
   * //   { type: 'text', field: 'name', header: 'name', sortable: true, visible: true },
   * //   { type: 'text', field: 'address.street', header: 'street', sortable: true, visible: true },
   * //   { type: 'text', field: 'address.city', header: 'city', sortable: true, visible: true },
   * //   { type: 'text', field: 'address.zip', header: 'zip', sortable: true, visible: true },
   * //   {
   * //     type: 'checkbox',
   * //     field: 'preferences.newsletter',
   * //     header: 'newsletter',
   * //     sortable: true,
   * //     visible: true,
   * //     checked: (row) => row['preferences.newsletter'],
   * //     onChange: (checked, row) => console.log('Checkbox changed', checked, row),
   * //   },
   * //   {
   * //     type: 'checkbox',
   * //     field: 'preferences.notifications',
   * //     header: 'notifications',
   * //     sortable: true,
   * //     visible: true,
   * //     checked: (row) => row['preferences.notifications'],
   * //     onChange: (checked, row) => console.log('Checkbox changed', checked, row),
   * //   },
   * //   {
   * //     type: 'button',
   * //     field: 'actions',
   * //     header: 'actions',
   * //     sortable: false,
   * //     visible: true,
   * //     label: (row) => 'Click Me',
   * //     onClick: (row) => console.log('Button clicked', row),
   * //   },
   * // ]
   */
  flattenAndMergeColumns<T>(
    obj: Record<string, any>,
    determineColumnType: (key: string, value: any, path: string) => Column<T>,
    existingColumns: Column<T>[],
    prefix?: string
  ): Column<T>[] {
    // Flatten the object into new columns
    const newColumns = (prefix === undefined)
      ? this.flattenObjectToColumns(obj, determineColumnType)
      : this.flattenObjectToColumns(obj, determineColumnType, prefix);

    // Merge new columns with existing columns
    const mergedColumns = [...existingColumns]; // Start with existing columns

    for (const newColumn of newColumns) {
      // Check if a column with the same field already exists
      const existingColumnIndex = mergedColumns.findIndex((col) => col.field === newColumn.field);

      if (existingColumnIndex === -1) {
        // If the column doesn't exist, add it
        mergedColumns.push(newColumn);
      } else {
        // If the column exists, merge the properties (optional: override or combine)
        mergedColumns[existingColumnIndex] = {
          ...mergedColumns[existingColumnIndex], // Keep existing properties
          ...newColumn, // Override with new properties
        };
      }
    }

    return mergedColumns;
  }
}
