import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

const checkboxConfig: MatCheckboxDefaultOptions = {
  clickAction: 'noop',
};

const formFieldConfig: MatFormFieldDefaultOptions = {
  appearance: 'outline',
  subscriptSizing: 'dynamic'
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    SearchBoxComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  exports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    SearchBoxComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: checkboxConfig },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldConfig },
  ]
})
export class CustomTableModule { }
