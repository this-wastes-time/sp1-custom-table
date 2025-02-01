import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class ServerPaginatorIntl extends MatPaginatorIntl {
  totalItemsKnown = false; // Whether totalItems has been determined
  private _totalItems: number | null = null;

  get totalItems(): number | null {
    return this._totalItems;
  }

  set totalItems(value: number | null) {
    this._totalItems = value;
    this.totalItemsKnown = value !== null; // Update the state
    this.changes.next(); // Notify paginator of changes
  }

  constructor() {
    super();
    this.itemsPerPageLabel = 'Items per page:';
    this.nextPageLabel = 'Next page';
    this.previousPageLabel = 'Previous page';
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (!this.totalItemsKnown) {
      const start = page * pageSize + 1;
      const end = Math.min((page + 1) * pageSize, length);
      return `${start}–${end} of many`;
    } else {
      const start = page * pageSize + 1;
      const end = Math.min((page + 1) * pageSize, this.totalItems ?? 0);
      return `${start}–${end} of ${this.totalItems}`;
    }
  };
}
