import { UnknownFunction, FocusOverlayPosition } from './types';
export declare const debounce: (callback: UnknownFunction, wait: number) => UnknownFunction;
/**
 * Cross browser transitionEnd event
 * https://davidwalsh.name/css-animation-callback
 * @return {String} Browser's supported transitionend type
 */
export declare const whichTransitionEvent: () => string;
export declare const absolutePosition: (el: Element) => FocusOverlayPosition;
/**
 * Suppresses the event.
 */
export declare const nothing: () => void;
