import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const DEBOUNCEWAIT = 250;

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Enable OnPush
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() id = 'search-box';
  @Input() appearance: MatFormFieldAppearance = 'fill';
  @Input() subscriptSizing: 'fixed' | 'dynamic' = 'fixed';
  @Input() label = 'Search';
  @Input() placeholder = 'Search...';
  @Input() value!: string;
  @Input() instantSearch = false;
  @Output() valueChange = new EventEmitter<string>();

  private inputSubject = new Subject<string>();
  private inputSubscription: any;

  ngOnInit(): void {
    this.inputSubscription = this.inputSubject.pipe(
      debounceTime(this.instantSearch ? 0 : DEBOUNCEWAIT),
      distinctUntilChanged()
    ).subscribe(value => {
      this.valueChange.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.inputSubscription.unsubscribe();
  }

  protected getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected onInputChange(value: string): void {
    this.inputSubject.next(value);
  }

  clear(): void {
    this.value = '';
    this.inputSubject.next(this.value);
  }
}
