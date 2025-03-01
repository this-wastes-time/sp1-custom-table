import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Observable } from 'rxjs';
import { Column, ColumnsConfig } from '../../models/column.model';
import { CustomTableModule } from '../../custom-table.module';

@Component({
  selector: 'app-modify-columns',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatButtonToggleModule, CustomTableModule],
  templateUrl: './modify-columns.component.html',
  styleUrl: './modify-columns.component.scss',
})
export class ModifyColumnsComponent implements OnInit {
  /**
   * Event emitter for column modifications.
   * @type {EventEmitter<Column[]>}
   */
  @Output() columnMods = new EventEmitter<Column<any>[]>();

  /**
   * Observable for column configuration.
   * @type {Observable<ColumnsConfig>}
   */
  columnConfig$ = new Observable<ColumnsConfig>();

  /**
   * Column configuration.
   * @type {ColumnsConfig}
   */
  protected config!: ColumnsConfig;

  /**
   * Modified columns.
   * @type {Column[]}
   */
  protected moddedCols: Column<any>[] = [];

  /**
   * Default state columns.
   * @type {Column[]}
   */
  defaultCols: Column<any>[] = [];

  /**
   * Initial top position for the element.
   * @type {number}
   */
  private readonly _initialTop = 16;

  /**
   * Height of each list item.
   * @type {number}
   */
  private readonly _listItemSizeHeight = 45;

  /**
   * Left position for the element.
   * @type {number}
   */
  private readonly _left = 10;

  /**
   * Indicates whether animations are enabled.
   * @type {boolean}
   */
  private _useAnimations = true;
  get useAnimations(): boolean {
    return this._useAnimations;
  }

  /**
   * Constructor to inject dependencies.
   * @param {ChangeDetectorRef} cdr - Change detector reference.
   */
  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
    this.columnConfig$.subscribe(config => {
      this.config = config;
      this.moddedCols = [...config.columns].map(col => ({
        ...col,
        visible: col.visible ?? true,
      }));
    });
  }

  /**
   * Toggles the visibility of a column.
   * @param {Column} column - The column to toggle.
   */
  protected toggleColumn(column: Column<any>): void {
    column.visible = !column.visible;
  }

  /**
   * Moves a column in the specified direction.
   * @param {number} index - The current index of the column.
   * @param {number} direction - The direction to move the column (-1 for up, 1 for down).
   */
  protected moveColumn(index: number, direction: number): void {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= this.moddedCols.length) return;
    [this.moddedCols[index], this.moddedCols[newIndex]] = [this.moddedCols[newIndex], this.moddedCols[index]];
  }

  /**
   * Resets the columns to their original order.
   */
  protected resetColumns(): void {
    this.moddedCols = this.defaultCols;
  }

  /**
   * Cancels the modifications and emits the original columns.
   */
  protected cancel(): void {
    this.columnMods.emit(this.config.columns);
  }

  /**
   * Closes the modification view and emits the modified columns.
   */
  protected close(): void {
    this.columnMods.emit(this.moddedCols);
  }
}
