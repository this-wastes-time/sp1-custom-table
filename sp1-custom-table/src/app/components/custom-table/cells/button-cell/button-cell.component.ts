import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button-cell',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button mat-stroked-button [color]="'accent'" (click)="clickFunc()">
      <span>{{ label }}</span>
    </button>
  `,
  styleUrl: './button-cell.component.scss'
})
export class ButtonCellComponent {
  @Input() label!: string;
  @Input() clickFunc!: () => void;
  @Output() clicked = new EventEmitter<void>();
}
