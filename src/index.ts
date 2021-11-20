'use strict';

const tabwrap = (element : HTMLElement) : void => {
    const tabbableSelector : string = 'a, button, input';
    const tabbableElements : Array<HTMLAnchorElement | HTMLButtonElement | HTMLInputElement> = Array.from(
        element.querySelectorAll(tabbableSelector) as NodeListOf<HTMLAnchorElement | HTMLButtonElement | HTMLInputElement>,
    );

    if (tabbableElements.length <= 1) {
        return;
    }

    const firstTabbableElement : HTMLAnchorElement | HTMLButtonElement | HTMLInputElement = tabbableElements[0];
    const lastTabbableElement : HTMLAnchorElement | HTMLButtonElement | HTMLInputElement = tabbableElements[tabbableElements.length - 1];

    let shouldWrap = false;

    (firstTabbableElement as HTMLElement).addEventListener('keydown', (event : KeyboardEvent) : void => {
        let isTabKey = typeof event.key !== 'undefined'
            ? event.key === 'Tab'
            : event.keyCode === 9;

        let isShiftKey = event.shiftKey;

        // only wrap if shift + tab was pressed
        shouldWrap = isTabKey && isShiftKey;
    });

    firstTabbableElement.addEventListener('blur', (event : Event) : void => {
        // move focus back down to last input when "tabbing away" backwards from first element

        if (! shouldWrap) {
            return;
        }

        lastTabbableElement.focus();
    });

    (lastTabbableElement as HTMLElement).addEventListener('keydown', (event : KeyboardEvent) : void => {
        let isTabKey = typeof event.key !== 'undefined'
            ? event.key === 'Tab'
            : event.keyCode === 9;

        let isShiftKey = event.shiftKey;

        // only wrap tab (without shift key) was pressed
        shouldWrap = isTabKey && ! isShiftKey;
    });

    lastTabbableElement.addEventListener('blur', (event : Event) : void => {
        // move focus back up to first input when "tabbing away" from last element

        if (! shouldWrap) {
            return;
        }

        shouldWrap = false;

        firstTabbableElement.focus();
    });
};

// allows "import tabwrap from '@devlop/tabwrap'" and "import { tabwrap } from '@devlop/tabwrap'"
export {
    tabwrap as default,
    tabwrap as tabwrap,
};
