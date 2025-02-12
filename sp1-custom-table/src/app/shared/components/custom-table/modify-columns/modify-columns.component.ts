import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Observable } from 'rxjs';
import { Column, ColumnsConfig } from '../models/column.model';

@Component({
  selector: 'app-modify-columns',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatButtonToggleModule],
  templateUrl: './modify-columns.component.html',
  styleUrl: './modify-columns.component.scss'
})
export class ModifyColumnsComponent implements OnInit {
  @Output() columnMods = new EventEmitter<Column[]>();

  columnConfig$ = new Observable<ColumnsConfig>();
  protected config!: ColumnsConfig;
  protected moddedCols: Column[] = [];

  ngOnInit(): void {
    this.columnConfig$.subscribe(config => {
      this.config = config;
      this.moddedCols = [...config.columns].map(col => ({ ...col, visible: col.visible ?? true }));
    });
  }

  protected toggleColumn(column: Column): void {
    column.visible = !column.visible;
  }

  protected moveColumn(index: number, direction: number): void {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= this.moddedCols.length) return;

    [this.moddedCols[index], this.moddedCols[newIndex]] = [this.moddedCols[newIndex], this.moddedCols[index]];
  }

  protected resetColumns(): void {
    this.moddedCols = [...this.config.columns].map(col => ({ ...col, visible: true }));
  }

  protected close(): void {
    this.columnMods.emit(this.moddedCols);
  }
}
