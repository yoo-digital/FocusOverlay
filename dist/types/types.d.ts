import FocusOverlay from './index';
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
    onInit: (focusOverlay: FocusOverlay) => void;
    onBeforeMove: (currentTarget: HTMLElement | null, nextTarget: HTMLElement | null, focusOverlay: FocusOverlay) => void;
    onAfterMove: (previousTarget: HTMLElement | null, currentTarget: HTMLElement | null, focusOverlay: FocusOverlay) => void;
    onDestroy: (focusOverlay: FocusOverlay) => void;
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
