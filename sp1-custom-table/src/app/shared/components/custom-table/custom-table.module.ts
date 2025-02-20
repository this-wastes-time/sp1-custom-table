import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GeneralSpinnerDirective } from '../../directives/general-spinner.directive';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReorderAnimationDirective } from '../../directives/reorder-animation.directive';
import { SpanFillerComponent } from '../span-filler/span-filler.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    GeneralSpinnerDirective,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSidenavModule,
    ReorderAnimationDirective,
    SpanFillerComponent,
    MatTooltipModule,
    SearchBarComponent,
  ],
  exports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    GeneralSpinnerDirective,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSidenavModule,
    ReorderAnimationDirective,
    SpanFillerComponent,
    MatTooltipModule,
    SearchBarComponent,
  ],
  providers: [
    provideNativeDateAdapter(),
  ]
})
export class CustomTableModule { }
