import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class RowSelectionService<T> {
  private _selectedRows = new Map<number, Set<T>>();
  private _selectionChange$ = new BehaviorSubject<T[]>([]);

  /**
   * Gets an observable that emits selection changes.
   * @returns An observable of the selected rows.
   */
  get selectionChanges() {
    return this._selectionChange$.asObservable();
  }

  /**
   * Selects a row.
   * @param row - The row to select.
   * @param pageIndex - The page index of the row.
   */
  selectRow(row: T, pageIndex: number) {
    if (!this._selectedRows.has(pageIndex)) {
      this._selectedRows.set(pageIndex, new Set<T>());
    }
    this._selectedRows.get(pageIndex)!.add(row);
    this._emitSelectionChange();
  }

  /**
   * Deselects a row.
   * @param row - The row to deselect.
   * @param pageIndex - The page index of the row.
   */
  deselectRow(row: T, pageIndex: number) {
    this._selectedRows.get(pageIndex)?.delete(row);
    if (this._selectedRows.get(pageIndex)?.size === 0) {
      this._selectedRows.delete(pageIndex);
    }
    this._emitSelectionChange();
  }

  /**
   * Checks if a row is selected.
   * @param row - The row to check.
   * @param pageIndex - The page index of the row.
   * @returns True if the row is selected, false otherwise.
   */
  isSelected(row: T, pageIndex: number): boolean {
    return this._selectedRows.get(pageIndex)?.has(row) ?? false;
  }

  /**
   * Clears all selected rows.
   */
  clearSelection() {
    this._selectedRows.clear();
    this._emitSelectionChange();
  }

  /**
   * Gets all selected rows.
   * @returns An array of all selected rows.
   */
  getSelectedRows(): T[] {
    return Array.from(this._selectedRows.values()).flatMap(set => Array.from(set));
  }

  /**
   * Emits the selection change event.
   * @private
   */
  private _emitSelectionChange() {
    this._selectionChange$.next(this.getSelectedRows());
  }
}
