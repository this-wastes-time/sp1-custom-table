import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pathValue',
  standalone: true,
  pure: true // Ensures efficient change detection
})
export class PathValuePipe implements PipeTransform {
  /**
   * Extracts a nested value from an object using a dot-notated field path.
   *
   * @template T - The type of the input object.
   * @template K - The expected return type of the value.
   * @param row - The object to retrieve the value from.
   * @param field - The dot-notated path to the property.
   * @returns The extracted value or undefined if not found.
   *
   * @example
   * // In a component:
   * const user = { name: 'Alice', address: { city: 'New York' } };
   * const city = this.pathValuePipe.transform<typeof user, string>(user, 'address.city');
   * console.log(city); // Outputs: 'New York'
   *
   * // In a template:
   * {{ user | pathValue:'address.city' }} <!-- Outputs 'New York' -->
   */
  transform<T, K>(row: T, field: string): K | undefined {
    // Handle empty cases
    if (!row || !field) return undefined;

    return field.split('.').reduce<any>((obj, key) => {
      return obj && typeof obj === 'object' && key in obj ? obj[key] : undefined;
    }, row) as K;
  }
}
