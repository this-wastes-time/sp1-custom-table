import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const DEBOUNCEWAIT = 300;

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [MatInputModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() id = 'search-box';
  @Input() label = 'Search';
  @Input() placeholder = 'Search...';
  @Output() inputChange = new EventEmitter<string>();

  private inputSubject = new Subject<string>();
  private inputSubscription: any;

  ngOnInit(): void {
    this.inputSubscription = this.inputSubject.pipe(
      debounceTime(DEBOUNCEWAIT),
      distinctUntilChanged()
    ).subscribe(value => {
      this.inputChange.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.inputSubscription.unsubscribe();
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onInputChange(value: string): void {
    this.inputSubject.next(value);
  }
}
