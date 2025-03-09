/**
 * Configuration for automatic table data refresh.
 *
 * @example
 * ```typescript
 * const autoRefreshConfig: AutoRefreshConfig = {
 *   enabled: true,
 *   onChange: (enabled) => { if (enabled) { refreshTableData(); } }
 * };
 * ```
 */
export interface AutoRefreshConfig {
  /**
   * Indicates whether auto-refresh is enabled.
   * When `true`, the table will automatically refresh at predefined intervals.
   */
  enabled: boolean;

  /**
   * Callback function triggered when the auto-refresh state changes.
   * Can be used to start or stop automatic data refresh.
   *
   * @param enabled - `true` if auto-refresh is enabled, `false` otherwise.
   *
   * @example
   * ```typescript
   * onChange: (enabled) => { if (enabled) { refreshTableData(); } }
   * ```
   */
  onChange: (enabled: boolean) => void;
}
