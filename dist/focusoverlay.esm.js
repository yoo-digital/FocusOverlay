/* Focus Overlay - v1.0.5
* https://github.com/mmahandev/FocusOverlay
* Copyright (c) 2020 mmahandev. Licensed MIT */
var t=function(){return(t=Object.assign||function(t){for(var e,o=1,n=arguments.length;o<n;o++)for(var i in e=arguments[o])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)};Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(t){var e=this;do{if(e.matches(t))return e;e=e.parentElement||e.parentNode}while(null!==e&&1===e.nodeType);return null});var e=function(t,e){var o;return function(){for(var n=[],i=0;i<arguments.length;i++)n[i]=arguments[i];clearTimeout(o),o=window.setTimeout(function(){return t.apply(void 0,n)},e)}},o=function(){var t=document.createElement("fakeelement");return Object.values({transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"}).forEach(function(e){return void 0!==t.style[e]?e:""}),""},n=function(){};!function(t){if(t&&"undefined"!=typeof window){var e=document.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t,document.head.appendChild(e)}}('.focus-overlay {\n  display: none;\n  position: relative;\n  transition: all 0.2s cubic-bezier(0, 1, 0, 1);\n}\n.focus-overlay::after {\n  content: "";\n  position: absolute;\n  z-index: 9999;\n  top: -4px;\n  right: -4px;\n  bottom: -4px;\n  left: -4px;\n  border: 1px solid #396aab;\n  border-radius: 0.3125em;\n  box-shadow: 0 0 3px 1px rgba(57, 106, 171, 0.6), inset 0 0 0 1px white;\n}\n.focus-overlay .focus-overlay-active {\n  display: block;\n}\n.focus-overlay-target {\n  outline: none;\n}');export default(function(){function i(i,s){var r=this;this.active=!1,this.scopedEl=null,this.focusBox=null,this.currentTarget=null,this.previousTarget=null,this.nextTarget=null,this.timeout=setTimeout(n,1),this.inScope=!1,this.transitionEvent=o(),this.options=t({class:"focus-overlay",activeClass:"focus-overlay-active",animatingClass:"focus-overlay-animating",targetClass:"focus-overlay-target",zIndex:9001,duration:500,inActiveAfterDuration:!1,triggerKeys:[9,36,37,38,39,40,13,32,16,17,18,27],inactiveOnNonTriggerKey:!0,inactiveOnClick:!0,alwaysActive:!1,watchTransitionEnd:!0,debounceScroll:!0,debounceResize:!0,debounceMs:150,onInit:n,onBeforeMove:n,onAfterMove:n,onDestroy:n},s),i instanceof HTMLElement?this.scopedEl=i:this.scopedEl="string"==typeof i?document.querySelector(i):document.querySelector("body"),this.onKeyDownHandler=this.onKeyDownHandler.bind(this),this.onFocusHandler=this.onFocusHandler.bind(this),this.moveFocusBox=this.moveFocusBox.bind(this),this.stop=this.stop.bind(this),this.debouncedMoveFocusBox=e(function(t){return r.moveFocusBox(t)},this.options.debounceMs),this.init()}return i.prototype.init=function(){this.options.alwaysActive?(this.active=!0,window.addEventListener("focusin",this.onFocusHandler,!0)):(window.addEventListener("keydown",this.onKeyDownHandler,!1),this.options.inactiveOnClick&&window.addEventListener("mousedown",this.stop,!1)),this.createFocusBox(),this.options.onInit(this)},i.prototype.onKeyDownHandler=function(t){var e=this,o=t.which;this.options.triggerKeys.includes(o)?(!1===this.active&&(this.active=!0,window.addEventListener("focusin",this.onFocusHandler,!0),this.options.debounceScroll&&window.addEventListener("scroll",this.debouncedMoveFocusBox,!0),this.options.debounceResize&&window.addEventListener("resize",this.debouncedMoveFocusBox,!1)),setTimeout(function(){var t,o=document.activeElement;o instanceof HTMLIFrameElement&&(null===(t=e.scopedEl)||void 0===t?void 0:t.contains(o))&&!0===e.active&&e.moveFocusBox(o)},5)):this.options.inactiveOnNonTriggerKey&&this.stop()},i.prototype.createFocusBox=function(){var t;this.focusBox=document.createElement("div"),this.focusBox.setAttribute("aria-hidden","true"),this.focusBox.classList.add(this.options.class),Object.assign(this.focusBox.style,{position:"absolute",zIndex:this.options.zIndex,pointerEvents:"none"}),null===(t=this.scopedEl)||void 0===t||t.insertAdjacentElement("beforeend",this.focusBox)},i.prototype.cleanup=function(){null!=this.nextTarget&&(this.previousTarget=this.nextTarget,this.previousTarget.classList.remove(this.options.targetClass),this.previousTarget.removeEventListener(this.transitionEvent,this.moveFocusBox))},i.prototype.onFocusHandler=function(t){var e,o=t.target;if(this.cleanup(),null===(e=this.scopedEl)||void 0===e?void 0:e.contains(o)){var n=this.nextTarget;this.inScope=!0;var i=o.getAttribute("data-focus");if(null!==i)this.nextTarget=o.closest(i);else if(null!==o.getAttribute("data-focus-label")){var s=document.querySelector("[for='"+o.id+"']");null===s&&(s=o.closest("label")),this.nextTarget=s}else{if(null!==o.getAttribute("data-focus-ignore"))return;this.nextTarget=o}this.currentTarget=this.nextTarget,clearTimeout(this.timeout),this.transitionEvent&&this.options.watchTransitionEnd&&this.nextTarget&&this.nextTarget.addEventListener(this.transitionEvent,this.moveFocusBox),this.options.onBeforeMove(n,this.nextTarget,this),this.moveFocusBox(this.nextTarget)}else this.options.alwaysActive?this.inScope=!1:(this.inScope=!1,this.stop())},i.prototype.stop=function(){var t;this.active=!1,window.removeEventListener("focusin",this.onFocusHandler,!0),this.options.debounceScroll&&window.removeEventListener("scroll",this.debouncedMoveFocusBox,!0),this.options.debounceResize&&window.removeEventListener("resize",this.debouncedMoveFocusBox,!1),this.cleanup(),null===(t=this.focusBox)||void 0===t||t.classList.remove(this.options.activeClass)},i.prototype.moveFocusBox=function(t){var e,o=this;if(t instanceof Event&&(t=this.currentTarget),null==t||t.classList.add(this.options.targetClass),document.body.contains(t)&&t instanceof Element&&this.focusBox){var n=function(t){var e,o=0,n=0,i=0,s=0,r=document.createElement("div");if(document.body&&(r.style.cssText="position:absolute;left:0;top:0",document.body.appendChild(r)),t&&t.ownerDocument===document&&"getBoundingClientRect"in t&&r){var a=t.getBoundingClientRect(),c=r.getBoundingClientRect();e=!0,o=a.left-c.left,n=a.top-c.top,i=a.right-a.left,s=a.bottom-a.top}return{found:e,left:o,top:n,width:i,height:s,right:o+i,bottom:n+s}}(t),i=n.width+"px",s=n.height+"px",r=n.left+"px",a=n.top+"px";this.focusBox.classList.add(this.options.animatingClass),this.focusBox.classList.add(this.options.activeClass),Object.assign(null===(e=this.focusBox)||void 0===e?void 0:e.style,{width:i,height:s,left:r,top:a}),this.timeout=setTimeout(function(){var e,n;null===(e=o.focusBox)||void 0===e||e.classList.remove(o.options.animatingClass),o.options.inActiveAfterDuration&&(null===(n=o.focusBox)||void 0===n||n.classList.remove(o.options.activeClass)),o.options.onAfterMove(o.previousTarget,t,o)},this.options.duration)}else this.cleanup()},i.prototype.destroy=function(){var t,e,o,n;null===(e=null===(t=this.focusBox)||void 0===t?void 0:t.parentNode)||void 0===e||e.removeChild(this.focusBox),null===(o=this.previousTarget)||void 0===o||o.classList.remove(this.options.targetClass),null===(n=this.nextTarget)||void 0===n||n.classList.remove(this.options.targetClass),window.removeEventListener("focusin",this.onFocusHandler,!0),window.removeEventListener("keydown",this.onKeyDownHandler,!1),window.removeEventListener("mousedown",this.stop,!1),this.options.debounceScroll&&window.removeEventListener("scroll",this.debouncedMoveFocusBox,!0),this.options.debounceResize&&window.removeEventListener("resize",this.debouncedMoveFocusBox,!1),this.options.onDestroy(this)},i}());
