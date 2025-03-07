import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneralSpinnerDirective } from '../../directives/general-spinner.directive';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SpanFillerComponent } from '../span-filler/span-filler.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { PathValuePipe } from '../../pipes/path-value.pipe';

const material = [
  CommonModule,
  MatTableModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatSortModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatTooltipModule,
  FormsModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [],
  imports: [
    material,
    GeneralSpinnerDirective,
    SpanFillerComponent,
    SearchBarComponent,
    PathValuePipe,
  ],
  exports: [
    material,
    GeneralSpinnerDirective,
    SpanFillerComponent,
    SearchBarComponent,
    PathValuePipe,
  ],
})
export class TableModule { }
