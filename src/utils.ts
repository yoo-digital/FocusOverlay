import {
  FocusOverlayPosition,
} from './types';

/**
 * Represents a function of an unknown amount of arguments.
 */
export type UnknownFunction = (...args: unknown[]) => void;

/*
 * Delays the processing of the given callback function until the user
 * has stopped calling said function for a predetermined amount of time.
 */
export const debounce = (callback: UnknownFunction, wait: number): UnknownFunction => {
  let timeout: number;
  return (...args: unknown[]): void => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), wait);
  };
};

/**
 * Cross browser transitionEnd event
 * https://davidwalsh.name/css-animation-callback
 * @return {String} Browser's supported transitionend type
 */
export const whichTransitionEvent = (): string => {
  const el = document.createElement('fakeelement');
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  };

  Object.values(transitions).forEach((transition: string): string => {
    if (el.style[(transition as any)] !== undefined) {
      return transition;
    }
    return '';
  });
  return '';
};

// https://stackoverflow.com/a/32623832/8862005
export const absolutePosition = (el: Element): FocusOverlayPosition => {
  let found;
  let left = 0;
  let top = 0;
  let width = 0;
  let height = 0;
  const offsetBase: HTMLElement = document.createElement('div');
  if (document.body) {
    offsetBase.style.cssText = 'position:absolute;left:0;top:0';
    document.body.appendChild(offsetBase);
  }
  if (
    el
    && el.ownerDocument === document
    && 'getBoundingClientRect' in el
    && offsetBase
  ) {
    const boundingRect = el.getBoundingClientRect();
    const baseRect = offsetBase.getBoundingClientRect();
    found = true;
    left = boundingRect.left - baseRect.left;
    top = boundingRect.top - baseRect.top;
    width = boundingRect.right - boundingRect.left;
    height = boundingRect.bottom - boundingRect.top;
  }
  return {
    found,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
};

/**
 * Suppresses the event.
 */
export const nothing = (): void => {
  // Do nothing
};
