import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SpanFillerComponent } from '../span-filler/span-filler.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PathValuePipe } from '../../pipes/path-value.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TruncatePipe } from '../../pipes/truncate.pipe';

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
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
];

const components = [
  SpanFillerComponent,
];

const pipes = [
  PathValuePipe,
  TruncatePipe,
];

@NgModule({
  declarations: [],
  imports: [
    material,
    components,
    pipes,
  ],
  exports: [
    material,
    components,
    pipes,
  ],
})
export class TableModule { }
