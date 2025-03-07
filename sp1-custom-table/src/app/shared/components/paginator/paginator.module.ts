import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpanFillerComponent } from '../span-filler/span-filler.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

const material = [
  CommonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatInputModule,
  FormsModule,
];

const components = [
  SpanFillerComponent,
];

@NgModule({
  declarations: [],
  imports: [
    material,
    components,
  ],
  exports: [
    material,
    components,
  ],
})
export class PaginatorModule { }
