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
  host: {
    '[class.has-focus]': 'expand && animateWidth',
  }
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
   * Whether to enable instant search and ignore debounce time.
   * @type {boolean}
   */
  @Input() instantSearch!: boolean;

  /**
   * Whether to animate the width of the search bar.
   * @type {boolean}
   */
  @Input() animateWidth!: boolean;

  /**
   * Placeholder text for the input field.
   * @type {string}
   */
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
  }
  private _placeholder!: string;

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
   * Value of the input field.
   * @type {string}
   */
  @Input() value!: string;

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

  ngOnInit(): void {
    if (this.value === undefined) {
      this.value = '';
    }

    this.searchControl.valueChanges.pipe(
      debounceTime(this.instantSearch ? 0 : DEBOUNCE_WAIT),
      takeUntil(this._destroy$),
      map((value: string | null) => value = value || '')
    ).subscribe(value => {
      // TODO: Don't update if previous value is the same as the new value.
      this.valueChange.emit(value);
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
   * Determines whether to show the clear button.
   * @returns {boolean} True if the clear button should be shown, false otherwise.
   */
  showClearButton(): boolean {
    return this.animateWidth ? this.focused : true;
  }

  /**
   * Handles the focus in event.
   */
  onFocusIn(): void {
    this.focused = true;
  }

  /**
   * Handles the blur event.
   */
  onBlur(): void {
    this.focused = false;
  }

  /**
   * Gets whether the search bar should expand.
   * @returns {boolean} True if the search bar should expand, false otherwise.
   */
  get expand(): boolean {
    return this.focused;
  }

  /**
   * Clears the search input.
   */
  clear(): void {
    this.searchControl.reset();
    this.valueChange.emit(this.searchControl.value || '');
  }
}
