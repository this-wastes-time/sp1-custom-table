import { AnimationBuilder, AnimationMetadata, style, animate } from '@angular/animations';
import { ComponentRef, Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

const STROKEWIDTH = 1.25;
const SPAMTIMER = 334;

@Directive({
  selector: '[appGeneralSpinner]',
  standalone: true
})
export class GeneralSpinnerDirective implements OnChanges {

  /**
   * Indicates whether the spinner should be displayed.
   * @type {boolean}
   */
  @Input({ required: true }) spinnerBusy = false;

  /**
   * The color of the spinner.
   * @type {ThemePalette}
   */
  @Input() spinnerColor: ThemePalette = 'primary';

  /**
   * The diameter of the spinner.
   * @type {number}
   */
  @Input() spinnerDiameter = 100;

  private spinner!: ComponentRef<MatProgressSpinner> | null;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    private aniBuilder: AnimationBuilder,
  ) { }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * @param {SimpleChanges} changes - The changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    // If there's no spinnerBusy value, skip all changes.
    if (changes['spinnerBusy'] === undefined) {
      return;
    }

    // Always update the disabled value based on spinnerBusy input then create/destroy spinner component.
    if (changes['spinnerBusy'].currentValue) {
      this.elementRef.nativeElement.disabled = this.spinnerBusy;
      this.createSpinner();
    } else {
      this.destroySpinner();
    }
  }

  /**
   * If there is no current spinner component, create one and append it to the DOM.
   */
  private createSpinner(): void {
    if (!this.spinner) {
      // Create a MatProgressSpinner component and set its properties and styling.
      this.spinner = this.viewContainerRef.createComponent(MatProgressSpinner);
      this.spinner.instance.color = this.spinnerColor;
      this.spinner.instance.strokeWidth = STROKEWIDTH;
      this.spinner.instance.diameter = this.spinnerDiameter;
      this.spinner.instance.mode = 'indeterminate';
      this.spinner.instance._elementRef.nativeElement.style.position = 'absolute';

      // Add the child MatProgressSpinner to the DOM inside the parent button.
      this.renderer.appendChild(
        this.elementRef.nativeElement,
        this.spinner.instance._elementRef.nativeElement
      );
    }
  }

  /**
   * Destroy current spinner component.
   */
  private destroySpinner(): void {
    if (this.spinner) {
      const factory = this.aniBuilder.build(this.fadeOut());
      const player = factory.create(this.spinner.instance._elementRef.nativeElement);
      player.play();

      // This timeout matches the fadeOut animation duration for animation reasons.
      setTimeout(() => {
        this.elementRef.nativeElement.disabled = this.spinnerBusy;
        this.spinner?.destroy();
        this.spinner = null;
      }, SPAMTIMER);
    }
  }

  /**
   * Creates and returns a fade out animation.
   * @returns {AnimationMetadata[]} - The fade out animation metadata.
   */
  private fadeOut(): AnimationMetadata[] {
    const settings = `${SPAMTIMER}ms ease-in`;
    return [
      style({ opacity: '*' }),
      animate(settings, style({ opacity: 0 })),
    ];
  }
}
