import { Pipe, PipeTransform } from '@angular/core';

/**
 * TruncatePipe - Truncates a string to a specified length and appends an ellipsis.
 *
 * This pipe is useful for limiting the length of text displayed in UI elements like tables and tooltips.
 *
 * @example
 * {{ 'This is a long text' | truncate:10 }}  // Output: 'This is a l...'
 *
 * @example
 * {{ 'Angular' | truncate:10 }}  // Output: 'Angular' (no truncation needed)
 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  /**
   * Transforms the input string by truncating it if it exceeds the specified limit.
   *
   * @param value - The string to be truncated.
   * @param limit - The maximum allowed length before truncation (default: 100).
   * @param ellipsis - The string to append when truncating (default: '...').
   * @returns The truncated string or an empty string if input is null/undefined.
   */
  transform(value: string | null | undefined, limit = 100, ellipsis = '...'): string {
    // Return empty string for null or undefined
    if (!value) {
      return '';
    }
    return value.length > limit ? value.substring(0, limit) + ellipsis : value;
  }
}
