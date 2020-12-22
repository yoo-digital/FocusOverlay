import './polyfills/closest';
import { FocusOverlayOptions } from './types';
import './styles.scss';
/**
 * The plugin constructor
 * @param {Element|String} element The DOM element where plugin is applied
 * @param {Partial<FocusOverlayOptions>} options Options passed to the constructor
 */
export default class FocusOverlay {
    private active;
    private scopedEl;
    private focusBox;
    private currentTarget;
    private previousTarget;
    private nextTarget;
    private timeout;
    private transitionEvent;
    private options;
    private debouncedMoveFocusBox;
    constructor(element: Element | string, options: Partial<FocusOverlayOptions>);
    /**
     * Initialize the plugin instance. Add event listeners
     * to the window depending on which options are enabled.
     */
    private init;
    /**
     * Handler method for the keydown event
     * @param {KeyboardEvent}
     */
    private onKeyDownHandler;
    /**
     * Creates the focusBox DIV element and appends itself to the DOM
     */
    private createFocusBox;
    /**
     * Cleanup method that runs whenever variables,
     * methods, etc. needs to be refreshed.
     */
    private cleanup;
    /**
     * Handler method for the focus event
     * @param {FocusEvent}
     */
    private onFocusHandler;
    /**
     * Ends the active state of the focusBox
     */
    private stop;
    /**
     * Moves the focusBox to a target element
     * @param {Element|Event|null} targetEl
     */
    moveFocusBox(targetEl: Element | Event | null): void;
    /**
     * The destroy method to free resources used by the plugin:
     * References, unregister listeners, etc.
     */
    destroy(): void;
}
