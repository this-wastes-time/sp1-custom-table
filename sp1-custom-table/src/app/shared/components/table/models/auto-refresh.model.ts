/**
 * Example usage of AutoRefreshConfig
 * @example
 * const autoRefreshConfig: AutoRefreshConfig = {
 *   enabled: true,
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
   * Function to call to refresh table data automatically.
   * @param {boolean} enabled - Indicates if auto-refresh is enabled
   * @type {function}
   */
  onChange: (enabled: boolean) => void;
}