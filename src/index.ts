'use strict';

const tabwrap = (rootElement : HTMLElement) : void => {
    let activeElement : HTMLElement | null = null;
    let tabKeyDetected : boolean = false;
    let shiftKeyDetected : boolean = false;

    let documentListenersSetUp : boolean = false;
    let documentFocusInListener : EventListenerOrEventListenerObject | null = null;
    let documentFocusOutListener : EventListenerOrEventListenerObject | null = null;
    let documentMousedownListener : EventListenerOrEventListenerObject | null = null;
    let documentKeydownListener : EventListenerOrEventListenerObject | null = null;

    const getTabbableElements = () : Array<HTMLElement> => {
        const tabbableSelectors : Array<string> = [
            'a[href]:not([tabindex^="-"])',
            'button:not([disabled]):not([tabindex^="-"])',
            'input:not([type="hidden"]):not([disabled]):not([tabindex^="-"])',
            'select:not([disabled]):not([tabindex^="-"])',
            'textarea:not([disabled]):not([tabindex^="-"])',
            '[tabindex]:not([tabindex^="-"])',
        ];

        const tabbableElements : Array<HTMLElement> = Array.from(
            rootElement.querySelectorAll(tabbableSelectors.join(',')) as NodeListOf<HTMLElement>,
        );

        return tabbableElements
            .filter((tabbableElement : HTMLElement) : boolean => {
                if (tabbableElement.offsetParent === null) {
                    // hidden parents
                    return false;
                }

                return true;
            })
            // attempt to respect tab order
            .sort((a : HTMLElement, b : HTMLElement) : number => {
                // tabindex="0" and omitted tab order are equals
                const aTabIndex : number = parseInt(a.getAttribute('tabindex') ?? '0');
                const bTabIndex : number = parseInt(b.getAttribute('tabindex') ?? '0');

                if (aTabIndex === bTabIndex) {
                    return 0;
                }

                return aTabIndex < bTabIndex
                    ? -1
                    : 1;
            });
    };

    const getFirstTabbableElement = () : HTMLElement | null => {
        return getTabbableElements().shift() ?? null;
    };

    const getLastTabbableElement = () : HTMLElement | null => {
        return getTabbableElements().pop() ?? null;
    };

    const focusFirstTabbableElement = () : void => {
        getFirstTabbableElement()?.focus();

        tabKeyDetected = false;
        shiftKeyDetected = false;
    };

    const focusLastTabbableElement = () : void => {
        getLastTabbableElement()?.focus();

        tabKeyDetected = false;
        shiftKeyDetected = false;
    };

    const elementIsInsideRootElement = (element : HTMLElement) : boolean => {
        return element === rootElement || rootElement.contains(element);
    };

    const setUpDocumentListeners = () : void => {
        // @ts-ignore FocusEvent is not assignable to EventListenerOrEventListenerObject
        documentFocusInListener = (event : FocusEvent) : void => {
            const focusTarget = event.target as HTMLElement;

            if (elementIsInsideRootElement(focusTarget)) {
                // focus-in target is inside the rootElement
                // we don't have anything to do here
                return;
            }

            if (tabKeyDetected === false) {
                // focus-in target is outside the rootElement but tab was not detected
                // tear down the document listeners
                tearDownDocumentListeners();

                return;
            }

            if (tabKeyDetected && ! shiftKeyDetected) {
                // focus-in target is outside the rootElement and tab was detected
                // focus the first tabbable element
                focusFirstTabbableElement();
            } else if (tabKeyDetected && shiftKeyDetected) {
                // focus-in target is outside the rootElement and tab + shift was detected
                // focus the last tabbable element
                focusLastTabbableElement();
            }
        };

        // @ts-ignore FocusEvent is not assignable to EventListenerOrEventListenerObject
        documentFocusOutListener = (event : FocusEvent) : void => {
            if (activeElement !== null && elementIsInsideRootElement(activeElement)) {
                // focus was lost because of a mouse click inside the rootElement
                // "focus" will still be somewhere inside rootElement
                // ignore and don't tear down document listeners
                return;
            }

            if (event.relatedTarget !== null) {
                // related target exist, meaning focusin will be triggered
                // do nothing here an let focusin handle the rest
                return;
            }

            // relatedTarget is missing so no focusin will be triggered
            // go ahead an and tear down the document listeners here
            tearDownDocumentListeners();
        };

        // @ts-ignore MouseEvent is not assignable to EventListenerOrEventListenerObject
        documentMousedownListener = (event : MouseEvent) : void => {
            if (! elementIsInsideRootElement(event.target as HTMLElement)) {
                // mousedown was detected outside the rootElement
                // disable wrapping and tear down document listeners
                tearDownDocumentListeners();
            }
        };

        // @ts-ignore KeyboardEvent is not assignable to EventListenerOrEventListenerObject
        documentKeydownListener = (event : KeyboardEvent) : void => {
            tabKeyDetected = typeof event.key !== 'undefined'
                ? event.key === 'Tab'
                : event.keyCode === 9;
            shiftKeyDetected = event.shiftKey;
            activeElement = event.target !== null
                ? event.target as HTMLElement
                : null;
        };

        // @ts-ignore no overload matches
        document.addEventListener('focusin', documentFocusInListener, {passive: true});
        // @ts-ignore no overload matches
        document.addEventListener('focusout', documentFocusOutListener, {passive: true});
        // @ts-ignore no overload matches
        document.addEventListener('mousedown', documentMousedownListener, {passive: true});
        // @ts-ignore no overload matches
        document.addEventListener('keydown', documentKeydownListener, {passive: true});

        documentListenersSetUp = true;
    };

    const tearDownDocumentListeners = () : void => {
        document.removeEventListener('focusin', documentFocusInListener !);
        document.removeEventListener('focusout', documentFocusOutListener !);
        document.removeEventListener('mousedown', documentMousedownListener !);
        document.removeEventListener('keydown', documentKeydownListener !);

        documentListenersSetUp = false;
    };

    rootElement.addEventListener('keydown', (event : KeyboardEvent) : void => {
        tabKeyDetected = typeof event.key !== 'undefined'
            ? event.key === 'Tab'
            : event.keyCode === 9;
        shiftKeyDetected = event.shiftKey;
        activeElement = event.target !== null
            ? event.target as HTMLElement
            : null;

        if (documentListenersSetUp === false) {
            setUpDocumentListeners();
        }

        if (tabKeyDetected && shiftKeyDetected) {
            if (activeElement !== null && activeElement === getFirstTabbableElement()) {
                event.preventDefault();

                focusLastTabbableElement();
            }
        } else if (tabKeyDetected && ! shiftKeyDetected) {
            if (activeElement !== null && activeElement === getLastTabbableElement()) {
                event.preventDefault();

                focusFirstTabbableElement();
            }
        }
    });

    // must be mousedown and not click, mousedown is triggered before focusout, click is triggered after
    rootElement.addEventListener('mousedown', (event : MouseEvent) : void => {
        tabKeyDetected = false;
        shiftKeyDetected = false;
        activeElement = event.target !== null
            ? event.target as HTMLElement
            : null;

        if (documentListenersSetUp === false) {
            setUpDocumentListeners();
        }
    }, {passive: true});

    rootElement.addEventListener('focusin', (event : Event) : void => {
        // setup document listeners
        if (documentListenersSetUp === false) {
            setUpDocumentListeners();
        }
    }, {passive: true});
};

// allows for both "import tabwrap from '@devlop/tabwrap'" and "import { tabwrap } from '@devlop/tabwrap'"
export {
    tabwrap as default,
    tabwrap as tabwrap,
};
