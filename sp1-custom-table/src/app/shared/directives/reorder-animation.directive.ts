import { AnimationPlayer, AnimationBuilder, animate, style } from '@angular/animations';
import { Directive, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

const DEFAULT_TIMING = '150ms ease-in-out';

/**
 * Directive to handle reorder animations for elements.
 */
@Directive({
  selector: '[appReorderAnimation]',
  exportAs: 'appReorderAnimation',
  standalone: true,
})
export class ReorderAnimationDirective implements OnInit {
  /**
   * Timing for the animation.
   * @type {string}
   */
  @Input() timing: string = DEFAULT_TIMING;

  /**
   * Top position for the element.
   * @type {number}
   */
  @Input() top!: number;

  /**
   * Left position for the element.
   * @type {number}
   */
  @Input() left!: number;

  /**
   * Original hidden element.
   * @type {HTMLElement}
   */
  protected original!: HTMLElement;

  /**
   * Copy of the element to be animated.
   * @type {HTMLElement}
   */
  protected copy!: HTMLElement;

  /**
   * Animation player instance.
   * @type {AnimationPlayer}
   */
  private _player!: AnimationPlayer;

  /**
   * Constructor to inject dependencies.
   * @param {TemplateRef<any>} templateRef - Reference to the template.
   * @param {ViewContainerRef} viewContainer - Reference to the view container.
   * @param {AnimationBuilder} builder - Animation builder.
   * @param {Renderer2} renderer - Renderer for DOM manipulations.
   */
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private builder: AnimationBuilder,
    private renderer: Renderer2,
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit() {
    this.original = this.createHiddenElement(this.templateRef);
    setTimeout(() => {
      this.copy = this.createVisibleElement(this.templateRef, this.top, this.left);
    });
  }

  /**
   * Creates a hidden element from the template.
   * @param {TemplateRef<any>} templateRef - Reference to the template.
   * @returns {HTMLElement} The created hidden element.
   */
  private createHiddenElement(templateRef: TemplateRef<any>): HTMLElement {
    const element = this.viewContainer.createEmbeddedView(templateRef).rootNodes[0];
    this.renderer.setStyle(element, 'visibility', 'hidden');
    return element;
  }

  /**
   * Creates a visible element from the template and sets its position.
   * @param {TemplateRef<any>} templateRef - Reference to the template.
   * @param {number} top - Top position for the element.
   * @param {number} left - Left position for the element.
   * @returns {HTMLElement} The created visible element.
   */
  private createVisibleElement(templateRef: TemplateRef<any>, top: number, left: number): HTMLElement {
    const element = this.viewContainer.createEmbeddedView(templateRef).rootNodes[0];
    this.renderer.setStyle(element, 'visibility', 'visible');
    this.renderer.setStyle(element, 'position', 'absolute');
    this.renderer.setStyle(element, 'width', '94.5%');
    this.renderer.setStyle(element, 'top', `${top}px`);
    this.renderer.setStyle(element, 'left', `${left}px`);
    return element;
  }

  /**
   * Triggers the animation to move the element to the specified position.
   */
  animateGo() {
    setTimeout(() => {
      const myAnimation = this.builder.build([
        animate(this.timing, style({ top: `${this.top}px`, left: `${this.left}px` }))
      ]);
      this._player = myAnimation.create(this.copy);
      this._player.play();
    });
  }
}
