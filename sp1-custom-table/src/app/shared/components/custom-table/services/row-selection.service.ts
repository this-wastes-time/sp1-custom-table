import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class RowSelectionService<T> {
  private _selectedRows = new Map<number, Set<T>>();
  private _selectionChange$ = new BehaviorSubject<T[]>([]);

  get selectionChanges() {
    return this._selectionChange$.asObservable();
  }

  selectRow(row: T, pageIndex: number) {
    if (!this._selectedRows.has(pageIndex)) {
      this._selectedRows.set(pageIndex, new Set<T>());
    }
    this._selectedRows.get(pageIndex)!.add(row);
    this._emitSelectionChange();
  }

  deselectRow(row: T, pageIndex: number) {
    this._selectedRows.get(pageIndex)?.delete(row);
    if (this._selectedRows.get(pageIndex)?.size === 0) {
      this._selectedRows.delete(pageIndex);
    }
    this._emitSelectionChange();
  }

  isSelected(row: T, pageIndex: number): boolean {
    return this._selectedRows.get(pageIndex)?.has(row) ?? false;
  }

  clearSelection() {
    this._selectedRows.clear();
    this._emitSelectionChange();
  }

  getSelectedRows(): T[] {
    return Array.from(this._selectedRows.values()).flatMap(set => Array.from(set));
  }

  private _emitSelectionChange() {
    this._selectionChange$.next(this.getSelectedRows());
  }
}
