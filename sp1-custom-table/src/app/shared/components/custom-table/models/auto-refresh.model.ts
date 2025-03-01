/**
 * Example usage of AutoRefreshConfig
 * @example
 * const autoRefreshConfig: AutoRefreshConfig = {
 *   enabled: true,
 *   intervalMs: 60000,
 *   autoRefreshFunc: (enabled) => { if (enabled) { refreshTableData(); } }
 * };
 */
export interface AutoRefreshConfig {
  /**
   * Whether the auto-refresh is currently on
   * @type {boolean}
   */
  enabled: boolean;
  /**
   * Interval time in milliseconds
   * @type {number}
   */
  intervalMs: number;
  /**
   * Function to call to refresh table data automatically.
   * @param {boolean} enabled - Indicates if auto-refresh is enabled
   * @type {function}
   */
  autoRefreshFunc: (enabled: boolean) => void;
}