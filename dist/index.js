'use strict';
var tabwrap = function (element) {
    var tabbableSelector = 'a, button, input';
    var tabbableElements = Array.from(element.querySelectorAll(tabbableSelector));
    if (tabbableElements.length <= 1) {
        return;
    }
    var firstTabbableElement = tabbableElements[0];
    var lastTabbableElement = tabbableElements[tabbableElements.length - 1];
    var shouldWrap = false;
    firstTabbableElement.addEventListener('keydown', function (event) {
        var isTabKey = typeof event.key !== 'undefined'
            ? event.key === 'Tab'
            : event.keyCode === 9;
        var isShiftKey = event.shiftKey;
        shouldWrap = isTabKey && isShiftKey;
    });
    firstTabbableElement.addEventListener('blur', function (event) {
        if (!shouldWrap) {
            return;
        }
        lastTabbableElement.focus();
    });
    lastTabbableElement.addEventListener('keydown', function (event) {
        var isTabKey = typeof event.key !== 'undefined'
            ? event.key === 'Tab'
            : event.keyCode === 9;
        var isShiftKey = event.shiftKey;
        shouldWrap = isTabKey && !isShiftKey;
    });
    lastTabbableElement.addEventListener('blur', function (event) {
        if (!shouldWrap) {
            return;
        }
        shouldWrap = false;
        firstTabbableElement.focus();
    });
};
export { tabwrap as default, tabwrap as tabwrap, };
