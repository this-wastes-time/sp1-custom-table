import { trigger, state, style, transition, animate } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, map, Subject, takeUntil } from 'rxjs';

const DEBOUNCE_WAIT = 500;

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatFormFieldModule, MatButtonModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('floatLabel', [
      state('float', style({
        transform: 'translateY(-1.5em)',
        opacity: 1,
      })),
      // Transition from placeholding to float
      transition('placeholding => float', [
        animate('0ms', style({ opacity: 0 })), // Fade out
        animate('100ms', style({ transform: 'translateY(-1.5em)' })), // Move
        animate('400ms ease-out', style({ opacity: 1 })), // Fade in
      ]),
    ])
  ]
})
export class SearchBarComponent implements OnInit {
  /**
   * Appearance of the form field.
   * @type {MatFormFieldAppearance}
   */
  @Input() appearance: MatFormFieldAppearance = 'outline';

  /**
   * Subscript sizing of the form field.
   * @type {'dynamic' | 'fixed'}
   */
  @Input() subscriptSizing: 'dynamic' | 'fixed' = 'dynamic';

  /**
   * Color of the form field.
   * @type {ThemePalette}
   */
  @Input() color: ThemePalette = 'primary';

  /**
   * Value of the input field.
   * @type {string}
   */
  @Input() value = '';

  /**
   * Label for the form field.
   * @type {string}
   */
  @Input() label!: string;

  /**
   * Whether to show the search icon.
   * @type {boolean}
   */
  @Input() showSearchIcon = true;

  /**
   * Placeholder text for the input field.
   * @type {string}
   */
  @Input() placeholder!: string;

  /**
   * Whether to enable instant search and ignore debounce time.
   * @type {boolean}
   */
  @Input()
  get instantSearch(): boolean {
    return this._instantSearch;
  }
  set instantSearch(value: BooleanInput) {
    this._instantSearch = coerceBooleanProperty(value);
  }
  private _instantSearch!: boolean;

  /**
   * Whether the input field is required.
   * @type {boolean}
   */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }
  private _required!: boolean;

  /**
   * Whether the input field is disabled.
   * @type {boolean}
   */
  @Input()
  get disabled(): boolean {
    return this.searchControl?.disabled;
  }
  set disabled(value: BooleanInput) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    value ? this.searchControl.disable() : this.searchControl.enable();
  }

  /**
   * Event emitter for value changes.
   * @type {EventEmitter<string>}
   */
  @Output() readonly valueChange = new EventEmitter<string>();

  /**
   * Form control for the search input.
   * @type {FormControl}
   */
  protected readonly searchControl = new FormControl({ value: this.value, disabled: this.disabled });

  /**
   * Subject to handle component destruction.
   * @type {Subject<void>}
   */
  private _destroy$ = new Subject<void>();

  /**
   * Static variable to generate unique IDs.
   * @type {number}
   */
  static nextId = 0;

  /**
   * Host binding for the component ID.
   * @type {string}
   */
  @HostBinding() id = `app-search-bar-${SearchBarComponent.nextId++}`;

  /**
   * ARIA label for the clear button.
   * @type {string}
   */
  protected readonly clearAriaLabel = `Clear ${this.id}`;

  /**
   * Whether the search bar is focused.
   * @type {boolean}
   */
  protected focused!: boolean;

  /**
   * The state of the floating label.
   * Can be 'placeholding' or 'float'.
   * @type {'placeholding' | 'float'}
   */
  protected floatState: 'placeholding' | 'float' = 'placeholding';

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(this.instantSearch ? 0 : DEBOUNCE_WAIT),
      takeUntil(this._destroy$),
      map((value: string | null) => value = value || '')
    ).subscribe(value => {
      if (this.value !== value) {
        this.value = value;
        this.valueChange.emit(value);
      }
    });
  }

  /**
   * Checks if the search input is empty.
   * @returns {boolean} True if the search input is empty, false otherwise.
   */
  protected empty(): boolean {
    return !this.searchControl.value;
  }

  /**
   * Handles the focus in event.
   */
  onFocusIn(): void {
    this.focused = true;
    this.floatState = 'float';
  }

  /**
   * Handles the blur event.
   */
  onBlur(): void {
    this.focused = false;
    this.floatState = this.value ? 'float' : 'placeholding';
  }

  /**
   * Clears the search input.
   */
  clear(): void {
    this.searchControl.setValue('');;
  }
}
