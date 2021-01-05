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

const capitalize = (string:string): string => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * getAnimatableEndEvent
 *
 * returns the name of transitionend/animationend event for cross browser compatibility
 *
 * @param {string} type of the animatableEvent: 'transition' or 'animation'
 * @returns {string} the transitionend/animationend event name
 */
export const getAnimatableEndEvent = (type: string): string => {
  let animatableEvent = '';

  const el = document.createElement('fakeelement');
  const capitalType = capitalize(type);

  const animations = {
    [type]: `${type}end`,
    [`O${capitalType}`]: `o${capitalType}End`,
    [`Moz${capitalType}`]: `${type}end`,
    [`Webkit${capitalType}`]: `webkit${capitalType}End`,
    [`MS${capitalType}`]: `MS${capitalType}End`,
  };

  const hasEventEnd = Object.keys(animations).some((item) => {
    if (el.style[item as any] !== undefined) {
      animatableEvent = animations[item];
      return true;
    }

    return false;
  });

  if (!hasEventEnd) {
    throw new Error(`${type}end is not supported in your web browser.`);
  }

  return animatableEvent;
};

// https://stackoverflow.com/a/32623832/8862005
export const absolutePosition = (el: Element): FocusOverlayPosition => {
  let found;
  let left = 0;
  let top = 0;
  let width = 0;
  let height = 0;
  if (
    el
    && el.ownerDocument === document
    && 'getBoundingClientRect' in el
  ) {
    const boundingRect = el.getBoundingClientRect();
    const baseRect = document.body.getBoundingClientRect();
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
