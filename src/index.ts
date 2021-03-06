import { FocusOverlayOptions } from './types';
import {
  debounce,
  absolutePosition,
  getAnimatableEndEvent,
  nothing,
} from './utils';

export type { FocusOverlayOptions } from './types';

/**
 * The plugin constructor
 * @param {Element|String} element The DOM element where plugin is applied
 * @param {Partial<FocusOverlayOptions>} options Options passed to the constructor
 */
export default class FocusOverlay {
  private active: boolean;

  private scopedEl: HTMLElement | null;

  private focusBox: HTMLElement | null;

  private currentTarget: HTMLElement | null;

  private previousTarget: HTMLElement | null;

  private nextTarget: HTMLElement | null;

  private timeout: NodeJS.Timeout;

  private transitionEvent: string;

  private animationEvent: string;

  private options: FocusOverlayOptions;

  private debouncedMoveFocusBox: () => void;

  public constructor(
    element: Element | string,
    options: Partial<FocusOverlayOptions>,
  ) {
    this.active = false;
    this.scopedEl = null;
    this.focusBox = null;
    this.currentTarget = null;
    this.previousTarget = null;
    this.nextTarget = null;
    this.timeout = setTimeout(nothing, 1);
    this.transitionEvent = getAnimatableEndEvent('transition');
    this.animationEvent = getAnimatableEndEvent('animation');
    this.options = {
      // Class added to the focus box
      class: 'focus-overlay',
      // Class added while the focus box is active
      activeClass: 'focus-overlay-active',
      // Class added while the focus box is animating
      animatingClass: 'focus-overlay-animating',
      // Class added to the target element
      targetClass: 'focus-overlay-target',
      // z-index of focus box
      zIndex: 9001,
      // Duration of the animatingClass (milliseconds)
      duration: 500,
      // Removes activeClass after duration
      inActiveAfterDuration: false,
      // Tab, Page up, Page down, End, Home, Arrow Keys, Enter, Space, Shift, Ctrl, Alt, ESC
      triggerKeys: [9, 33, 34, 35, 36, 37, 38, 39, 40, 13, 32, 16, 17, 18, 27],
      // Make focus box inactive when a non specified key is pressed
      inactiveOnNonTriggerKey: false,
      // Make focus box inactive when a user clicks
      inactiveOnClick: true,
      // Force the box to always stay active. Overrides everything
      alwaysActive: false,
      // Reposition focus box on transitionEnd for focused elements
      watchTransitionEnd: true,
      // Reposition focus box on animationEnd based on the window object
      watchAnimationEnd: true,
      // Reposition focus box on scroll event (debounce: default 150ms)
      debounceScroll: true,
      // Reposition focus box on resize event (debounce: default 150ms)
      debounceResize: true,
      // Defines the waiting time for the debounce function in milliseconds.
      debounceMs: 150,
      // Initialization event
      onInit: nothing,
      // Before focus box move
      onBeforeMove: nothing,
      // After focus box move
      onAfterMove: nothing,
      // After FocusOverlay is destroyed
      onDestroy: nothing,
      ...options,
    };

    /**
     * Setup main scoped element. First expect a DOM element, then
     * fallback to a string querySelector, and finally fallback to <body>
     */
    if (element instanceof HTMLElement) {
      this.scopedEl = element;
    } else if (typeof element === 'string') {
      this.scopedEl = document.querySelector(element);
    } else {
      this.scopedEl = document.querySelector('body');
    }

    // Binding
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onFocusInHandler = this.onFocusInHandler.bind(this);
    this.onFocusOutHandler = this.onFocusOutHandler.bind(this);
    this.moveFocusBox = this.moveFocusBox.bind(this);
    this.stop = this.stop.bind(this);
    this.debouncedMoveFocusBox = debounce(
      (e) => this.moveFocusBox(e as Event),
      this.options.debounceMs,
    );

    // Initialize
    this.init();
  }

  /**
   * Initialize the plugin instance. Add event listeners
   * to the window depending on which options are enabled.
   */
  private init(): void {
    if (this.options.alwaysActive) {
      this.active = true;
      window.addEventListener('focusin', this.onFocusInHandler, true);
    } else {
      window.addEventListener('keydown', this.onKeyDownHandler, false);

      if (this.options.inactiveOnClick) {
        window.addEventListener('mousedown', this.stop, false);
      }
    }

    this.createFocusBox();
    this.options.onInit(this);
  }

  /**
   * Handler method for the keydown event
   * @param {KeyboardEvent}
   */
  private onKeyDownHandler(e: KeyboardEvent): void {
    const code = e.which;

    // Checks if the key pressed is in the triggerKeys array
    if (this.options.triggerKeys.includes(code)) {
      if (this.active === false) {
        this.active = true;
        window.addEventListener('focusin', this.onFocusInHandler, true);
        window.addEventListener('focusout', this.onFocusOutHandler, false);

        if (this.options.debounceScroll) {
          window.addEventListener('scroll', this.debouncedMoveFocusBox, true);
        }
        if (this.options.debounceResize) {
          window.addEventListener('resize', this.debouncedMoveFocusBox, false);
        }
        if (this.options.watchAnimationEnd) {
          window.addEventListener(
            this.animationEvent,
            this.debouncedMoveFocusBox,
          );
        }
      }

      /**
       * Iframes don't trigger a focus event so I hacked this check in there.
       * Slight delay on the setTimeout for cross browser reasons.
       * See https://stackoverflow.com/a/28932220/8862005
       */
      setTimeout(() => {
        const activeEl = document.activeElement;

        /**
         * Check if the active element is an iframe, is part of
         * the scope, and that focusOverlay is currently active.
         */
        if (
          activeEl instanceof HTMLIFrameElement
          && this.scopedEl?.contains(activeEl)
          && this.active === true
        ) {
          this.moveFocusBox(activeEl);
        }
      }, 5);
    } else if (this.options.inactiveOnNonTriggerKey) {
      this.stop();
    }
  }

  /**
   * Creates the focusBox DIV element and appends itself to the DOM
   */
  private createFocusBox(): void {
    this.focusBox = document.createElement('div');
    this.focusBox.setAttribute('aria-hidden', 'true');
    this.focusBox.classList.add(this.options.class);

    Object.assign(this.focusBox.style, {
      position: 'absolute',
      zIndex: this.options.zIndex,
      pointerEvents: 'none',
    });

    this.scopedEl?.insertAdjacentElement('beforeend', this.focusBox);
  }

  /**
   * Cleanup method that runs whenever variables,
   * methods, etc. needs to be refreshed.
   */
  private cleanup(): void {
    // Remove previous target's classes and event listeners
    if (this.nextTarget != null) {
      this.previousTarget = this.nextTarget;
      this.previousTarget.classList.remove(this.options.targetClass);
      this.previousTarget.removeEventListener(
        this.transitionEvent,
        this.moveFocusBox,
      );
    }
  }

  /**
   * Handler method for the focusout event
   * @param {FocusEvent}
   */
  private onFocusOutHandler(e: FocusEvent): void {
    this.cleanup();

    // If the next element is not in scope, stop being active.
    // It is necessary to add the focusin event listener again
    // in case the focus returns form an element, which is currently not in scope
    // (thus it would not trigger an onKeyDownEvent, which would add the event listeners)
    if (e.relatedTarget == null) {
      this.stop();
      window.addEventListener('focusout', this.onFocusOutHandler, false);
      window.addEventListener('focusin', this.onFocusInHandler, true);
    }
  }

  /**
   * The 'data-focus-offset' property let's you customize the default offset value of the
   * focus box. The class name 'focus-overlay-offset' indicates whether a custom offset is
   * currently set or not.
   *
   * @param {HTMLElement}
   */
  private setFocusBoxOffset(focusedElement: HTMLElement): void {
    const { focusBox } = this;
    if (focusBox) {
      // If a custom offset is defined, remove the class and reset the CSS offset variable
      // to the default value.
      if (focusBox.classList.contains('focus-overlay-offset')) {
        focusBox.classList.remove('focus-overlay-offset');
        focusBox.style.removeProperty('--focus-overlay-offset');
      }

      // If the data attribute 'data-focus-offset' is defined on the focusedElement,
      // add the class and override the CSS offset variable to the given value.
      const focusOffset = focusedElement.getAttribute('data-focus-offset');
      if (focusOffset !== null) {
        focusBox.classList.add('focus-overlay-offset');
        focusBox.style.setProperty('--focus-overlay-offset', focusOffset);
      }
    }
  }

  /**
   * Handler method for the focusin event
   * @param {FocusEvent}
   */
  private onFocusInHandler(e: FocusEvent): void {
    const focusedEl = e.target as HTMLElement;

    // If the focused element is a child of the main element
    if (this.scopedEl?.contains(focusedEl)) {
      // Variable to be added to onBeforeMove event later
      const currentEl = this.nextTarget;

      this.setFocusBoxOffset(focusedEl);

      // If the focused element has data-focus then assign a new target
      const focusSelector = focusedEl.getAttribute('data-focus');
      if (focusSelector !== null) {
        this.nextTarget = focusedEl.closest(focusSelector);

        // If the focused element has data-focus-label then focus the associated label
      } else if (focusedEl.getAttribute('data-focus-label') !== null) {
        let associatedEl: HTMLElement | null = document.querySelector(`[for='${focusedEl.id}']`);

        // If there is no label pointing directly to the focused element,
        // then point to the wrapping label.
        if (associatedEl === null) {
          associatedEl = focusedEl.closest('label');
        }

        this.nextTarget = associatedEl;

        // If the focused element has data-ignore then stop
      } else if (focusedEl.getAttribute('data-focus-ignore') !== null) {
        return;

        // If none of the above is true then set the target as the currently focused element
      } else {
        this.nextTarget = focusedEl;
      }

      this.currentTarget = this.nextTarget;

      /**
       * Clear the timeout of the duration just in case if the
       * user focuses a new element before the timer runs out.
       */
      clearTimeout(this.timeout);

      /**
       * If transitionEnd is supported and watchTransitionEnd is enabled
       * add a check to make the focusBox recalculate its position
       * if the focused element has a long transition on focus.
       */
      if (this.transitionEvent && this.options.watchTransitionEnd && this.nextTarget) {
        this.nextTarget.addEventListener(
          this.transitionEvent,
          this.moveFocusBox,
        );
      }

      this.options.onBeforeMove(currentEl, this.nextTarget, this);
      // This timeout avoids incorrect positioning of the focus if the next target element
      // changes its position instantly after the focus has been applied.
      setTimeout(() => {
        this.moveFocusBox(this.nextTarget);
      }, 1);

      // If the focused element is a child of the main element but alwaysActive do nothing
    } else if (this.options.alwaysActive) {
      // If the element focused is not a child of the main element stop being active
    } else {
      this.stop();
    }
  }

  /**
   * Ends the active state of the focusBox
   */
  private stop(): void {
    this.active = false;
    window.removeEventListener('focusin', this.onFocusInHandler, true);
    window.removeEventListener('focusout', this.onFocusOutHandler, false);
    if (this.options.debounceScroll) {
      window.removeEventListener('scroll', this.debouncedMoveFocusBox, true);
    }
    if (this.options.debounceResize) {
      window.removeEventListener('resize', this.debouncedMoveFocusBox, false);
    }
    if (this.options.watchAnimationEnd) {
      window.removeEventListener(
        this.animationEvent,
        this.debouncedMoveFocusBox,
      );
    }
    this.cleanup();
    this.focusBox?.classList.remove(this.options.activeClass);
  }

  /**
   * Moves the focusBox to a target element
   * @param {HTMLElement|Event|null} targetEl
   */
  public moveFocusBox(target: HTMLElement | Event | null): void {
    // When passed as a handler we'll get the event target
    if (target instanceof Event) {
      // eslint-disable-next-line no-param-reassign
      target = this.currentTarget;
    }

    const targetEl: HTMLElement | null = target;

    // Marking current element as being targeted
    targetEl?.classList.add(this.options.targetClass);

    /**
     * Check to see if what we're targeting is actually still there.
     * Then check to see if we're targeting a DOM element. There was
     * an IE issue with the document and window sometimes being targeted
     * and throwing errors since you can't get the position values of those.
     */
    if (document.body.contains(targetEl) && targetEl instanceof HTMLElement && this.focusBox) {
      const rect = absolutePosition(targetEl);
      const width = `${rect.width}px`;
      const height = `${rect.height}px`;
      const left = `${rect.left}px`;
      const top = `${rect.top}px`;

      this.focusBox.classList.add(this.options.animatingClass);
      this.focusBox.classList.add(this.options.activeClass);

      Object.assign(this.focusBox?.style, {
        width,
        height,
        left,
        top,
      });

      // Remove animating/active class after the duration ends.
      this.timeout = setTimeout(() => {
        this.focusBox?.classList.remove(this.options.animatingClass);

        if (this.options.inActiveAfterDuration) {
          this.focusBox?.classList.remove(this.options.activeClass);
        }

        this.options.onAfterMove(this.previousTarget, targetEl, this);
      }, this.options.duration);
    } else {
      this.cleanup();
    }
  }

  /**
   * The destroy method to free resources used by the plugin:
   * References, unregister listeners, etc.
   */
  public destroy(): void {
    // Remove focusBox
    this.focusBox?.parentNode?.removeChild(this.focusBox);

    // Remove any extra classes given to other elements if they exist
    this.previousTarget?.classList.remove(this.options.targetClass);
    this.nextTarget?.classList.remove(this.options.targetClass);

    // Remove event listeners
    window.removeEventListener('focusin', this.onFocusInHandler, true);
    window.removeEventListener('focusout', this.onFocusOutHandler, false);
    window.removeEventListener('keydown', this.onKeyDownHandler, false);
    window.removeEventListener('mousedown', this.stop, false);
    if (this.options.debounceScroll) {
      window.removeEventListener('scroll', this.debouncedMoveFocusBox, true);
    }
    if (this.options.debounceResize) {
      window.removeEventListener('resize', this.debouncedMoveFocusBox, false);
    }
    if (this.options.watchAnimationEnd) {
      window.removeEventListener(
        this.animationEvent,
        this.debouncedMoveFocusBox,
      );
    }

    this.options.onDestroy(this);
  }
}
