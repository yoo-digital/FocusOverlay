/**
 * Represents a function of an unknown amount of arguments.
 */
export declare type UnknownFunction = (...args: unknown[]) => void;
export interface FocusOverlayOptions {
    class: string;
    activeClass: string;
    animatingClass: string;
    targetClass: string;
    zIndex: number;
    duration: number;
    inActiveAfterDuration: boolean;
    triggerKeys: number[];
    inactiveOnNonTriggerKey: boolean;
    inactiveOnClick: boolean;
    alwaysActive: boolean;
    watchTransitionEnd: boolean;
    debounceScroll: boolean;
    debounceResize: boolean;
    debounceMs: number;
    onInit: UnknownFunction;
    onBeforeMove: UnknownFunction;
    onAfterMove: UnknownFunction;
    onDestroy: UnknownFunction;
}
export interface FocusOverlayPosition {
    found: boolean | undefined;
    left: number;
    top: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
}
