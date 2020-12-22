import { FocusOverlayPosition } from './types';
/**
 * Represents a function of an unknown amount of arguments.
 */
export declare type UnknownFunction = (...args: unknown[]) => void;
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
