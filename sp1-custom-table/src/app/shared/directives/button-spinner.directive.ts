import { animate, AnimationBuilder, AnimationMetadata, style } from '@angular/animations';
import { ComponentRef, Directive, Input, OnChanges, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

const STROKEWIDTH = 1.25;
const SPAMTIMER = 334;

@Directive({
  selector: 'button[buttonSpinner]',
  standalone: true
})
export class ButtonSpinnerDirective implements OnChanges {

  @Input() spinnerBusy = false;
  @Input() spinnerColor: ThemePalette;

  private spinner!: ComponentRef<MatProgressSpinner> | null;

  constructor(
    private matButton: MatButton,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    private aniBuilder: AnimationBuilder,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // If there's no spinnerBusy value, skip all changes.
    if (!changes['spinnerBusy']) {
      return;
    }

    // Always update the disabled value based on spinnerBusy input then create/destroy spinner component.
    if (changes['spinnerBusy'].currentValue) {
      this.matButton.disabled = this.spinnerBusy;
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
      // Calculate diameter and spacing.
      const diameter = this.matButton._elementRef.nativeElement.offsetHeight - Math.ceil(this.matButton._elementRef.nativeElement.offsetHeight * .1);
      const marginLeft = Math.ceil(parseFloat(getComputedStyle(this.matButton._elementRef.nativeElement).width) / 2) - (diameter / 2);

      // Create a MatProgressSpinner component and set its properties and styling.
      this.spinner = this.viewContainerRef.createComponent(MatProgressSpinner);
      this.spinner.instance.color = this.spinnerColor ?? this.matButton.color;
      this.spinner.instance.strokeWidth = STROKEWIDTH;
      this.spinner.instance.diameter = diameter;
      this.spinner.instance.mode = 'indeterminate';
      this.spinner.instance._elementRef.nativeElement.style.position = 'absolute';
      this.spinner.instance._elementRef.nativeElement.style.marginLeft = JSON.stringify(marginLeft) + 'px';

      // Update button display styling.
      this.matButton._elementRef.nativeElement.style.display = 'grid';

      // Add the child MatProgressSpinner to the DOM inside the parent button.
      this.renderer.appendChild(
        this.matButton._elementRef.nativeElement,
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
        this.matButton.disabled = this.spinnerBusy;
        this.spinner?.destroy();
        this.spinner = null;
      }, SPAMTIMER);
    }
  }

  /**
   * Creates and returns a fade out animation.
   * @returns 
   */
  private fadeOut(): AnimationMetadata[] {
    const settings = `${SPAMTIMER}ms ease-in`;
    return [
      style({ opacity: '*' }),
      animate(settings, style({ opacity: 0 })),
    ];
  }
}
