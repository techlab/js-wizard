/*!
* JS Wizard v0.0.1 (http://techlaboratory.net/js-wizard)
* The awesome JavaScript step wizard library
* Created by Dipu Raj (https://github.com/techlab)
* Licensed under MIT (https://github.com/techlab/js-wizard/blob/main/LICENSE)
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

const applyTo = (value, cb) => {
    const obj = Object(value);
    if (Symbol.iterator in obj) {
        value.forEach((v) => {
            if (v) {
                cb(v);
            }
        });
    }
    else {
        if (value) {
            cb(value);
        }
    }
};
const getElement = (selector) => {
    return document.querySelector(selector);
};
const getChildren = (selector, root = document) => {
    return root.querySelectorAll(selector);
};
const findElement = (selector, root = document) => {
    return root.querySelector(selector);
};
const findElements = (selector, root = document) => {
    return root.querySelectorAll(selector);
};
const getFirstDescendant = (selector, root = document) => {
    // Check for first level element
    let elm = root.querySelector(selector);
    if (elm !== null) {
        return elm;
    }
    // Check for second level element
    root.querySelectorAll('*').forEach((element) => {
        let tmp = element.querySelector(selector);
        if (tmp !== null) {
            elm = tmp;
            return false;
        }
    });
    if (elm !== null) {
        return elm;
    }
    return false;
};
const addClass = (className, element) => {
    const cls = className.split(' ');
    applyTo(element, (el) => {
        if (el.classList) {
            el.classList.add(...cls);
        }
        else {
            el.className += (el.className ? ' ' : '') + className;
        }
    });
};
const removeClass = (className, element) => {
    const cls = className.split(' ');
    applyTo(element, (el) => {
        if (el.classList) {
            el.classList.remove(...cls);
        }
        else {
            let clsNames = el.className;
            cls.forEach((c) => {
                clsNames = clsNames.replace(c, ' ');
            });
            el.className = clsNames;
        }
    });
};
const removeClassByPrefix = (element, classNamePrefix) => {
    applyTo(element, (el) => {
        el.classList.forEach((className) => {
            if (className.startsWith(classNamePrefix)) {
                el.classList.remove(className);
            }
        });
        // var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
        // el.className = el.className.replace(regx, '');
    });
};
const hasClass = (className, element) => {
    if (element.classList)
        return element.classList.contains(className);
    return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};
const hideElement = (element) => {
    applyTo(element, (el) => {
        el.style.display = "none";
    });
};
const showElement = (element) => {
    applyTo(element, (el) => {
        el.style.display = "block";
    });
};
const addEvent = (element, event, listener) => {
    applyTo(element, (el) => {
        el.addEventListener(event, listener);
    });
};
const triggerEvent = (el, eventName, data = {}) => {
    return el.dispatchEvent(new CustomEvent(eventName, data));
};
const getAttribute = (el, attributeName) => {
    return el.getAttribute(attributeName);
};
const setAttribute = (el, attributeName, value) => {
    el.setAttribute(attributeName, value);
};
const getElementWidth = (element) => {
    return element.offsetWidth;
};
const getElementHeight = (element) => {
    return element.offsetHeight;
};
const setElementWidth = (element, val) => {
    element.style.width = val;
};
const setElementHeight = (element, val) => {
    element.style.height = val;
};
const setHtml = (element, content) => {
    element.innerHTML = content;
};
const appendElement = (element, content) => {
    element.insertAdjacentElement('beforebegin', content);
};
const prependElement = (element, content) => {
    element.insertAdjacentElement('afterend', content);
};

const defaultOptions = {
    selected: 0,
    theme: 'default',
    justified: true,
    autoAdjustHeight: true,
    backButtonSupport: true,
    enableUrlHash: true,
    transition: {
        name: 'default',
        animationShow: '',
        animationHide: '',
        // TODO: Impletemt these and remove above
        animation: 'none',
        speed: '400',
        easing: '',
        prefixCss: '',
        fwdShowCss: '',
        fwdHideCss: '',
        bckShowCss: '',
        bckHideCss: '', // Only used if animation is 'css'. Step hide Animation CSS on backward direction
    },
    toolbar: {
        position: 'bottom',
        showNextButton: true,
        showPreviousButton: true,
        extraHtml: '' // Extra html to show on toolbar
    },
    anchor: {
        enableNavigation: true,
        enableNavigationAlways: false,
        enableDoneState: true,
        markPreviousStepsAsDone: true,
        unDoneOnBackNavigation: false,
        enableDoneStateNavigation: true // Enable/Disable the done state navigation
    },
    keyboard: {
        keyNavigation: true,
        keyLeft: [37],
        keyRight: [39] // Right key code
    },
    lang: {
        next: 'Next',
        previous: 'Previous'
    },
    style: {
        mainCss: 'jsw',
        navCss: 'nav',
        navLinkCss: 'nav-link',
        contentCss: 'tab-content',
        contentPanelCss: 'tab-pane',
        themePrefixCss: 'jsw-theme-',
        anchorDefaultCss: 'default',
        anchorDoneCss: 'done',
        anchorActiveCss: 'active',
        anchorDisabledCss: 'disabled',
        anchorHiddenCss: 'hidden',
        anchorErrorCss: 'error',
        anchorWarningCss: 'warning',
        justifiedCss: 'jsw-justified',
        btnCss: 'jsw-btn',
        btnNextCss: 'jsw-btn-next',
        btnPrevCss: 'jsw-btn-prev',
        loaderCss: 'jsw-loading',
        progressCss: 'progress',
        progressBarCss: 'progress-bar',
        toolbarCss: 'toolbar',
        toolbarPrefixCss: 'toolbar-',
    },
    disabledSteps: [],
    errorSteps: [],
    warningSteps: [],
    hiddenSteps: [],
    getContent: null, // Callback function for content loading
};

const transitions = {
    default: (elmToShow, elmToHide, callback) => {
        elmToHide == null || hideElement(elmToHide);
        showElement(elmToShow);
        callback();
    },
    fade: (elmToShow, elmToHide, callback) => {
        const fadeIn = ((element) => {
            var op = 0.1; // initial opacity
            element.style.display = 'block';
            var timer = setInterval(() => {
                if (op >= 1) {
                    clearInterval(timer);
                    callback();
                }
                element.style.opacity = op.toString();
                element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                op += op * 0.1;
            }, 10);
        });
        if (elmToHide !== null) {
            ((element) => {
                var op = 1; // initial opacity
                var timer = setInterval(() => {
                    if (op <= 0.1) {
                        clearInterval(timer);
                        element.style.display = 'none';
                        fadeIn(elmToShow);
                    }
                    element.style.opacity = op.toString();
                    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op -= op * 0.1;
                }, 10);
            })(elmToHide);
        }
        else {
            fadeIn(elmToShow);
        }
    },
    css: (elmToShow, elmToHide, callback) => {
        elmToHide == null || hideElement(elmToHide);
        showElement(elmToShow);
        callback();
    },
};
// export default transitions;

var _Wizard_instances, _Wizard_options, _Wizard_main, _Wizard_nav, _Wizard_container, _Wizard_steps, _Wizard_pages, _Wizard_progressbar, _Wizard_dir, _Wizard_current_index, _Wizard_is_init, _Wizard_getDir, _Wizard_setElements, _Wizard_setTheme, _Wizard_setEvents, _Wizard_setToolbar, _Wizard_createToolbar, _Wizard_navigate, _Wizard_showStep, _Wizard_loadContent, _Wizard_transit, _Wizard_fixHeight, _Wizard_setProgressbar, _Wizard_setAnchor, _Wizard_setURLHash, _Wizard_getStepDirection, _Wizard_getStepPosition, _Wizard_isEnabled, _Wizard_isShowable, _Wizard_getAnchor, _Wizard_getPage, _Wizard_isDone, _Wizard_getURLHashIndex, _Wizard_getShowable, _Wizard_setButtons, _Wizard_keyNav;
class Wizard {
    constructor(selector, options = {}, autoload = true) {
        _Wizard_instances.add(this);
        // Private properties
        _Wizard_options.set(this, void 0);
        _Wizard_main.set(this, void 0);
        _Wizard_nav.set(this, void 0);
        _Wizard_container.set(this, void 0);
        _Wizard_steps.set(this, void 0);
        _Wizard_pages.set(this, void 0);
        _Wizard_progressbar.set(this, void 0);
        _Wizard_dir.set(this, void 0);
        _Wizard_current_index.set(this, void 0);
        _Wizard_is_init.set(this, void 0);
        // Public properties
        this.transitions = transitions;
        // Merge user options with default options
        this.options = options;
        // Main element
        __classPrivateFieldSet(this, _Wizard_main, getElement(selector), "f");
        // Navigation bar element
        __classPrivateFieldSet(this, _Wizard_nav, getFirstDescendant('.nav', __classPrivateFieldGet(this, _Wizard_main, "f")), "f");
        // Content container element
        __classPrivateFieldSet(this, _Wizard_container, getFirstDescendant('.tab-content', __classPrivateFieldGet(this, _Wizard_main, "f")), "f");
        // Anchor elements
        __classPrivateFieldSet(this, _Wizard_steps, getChildren('.nav-link', __classPrivateFieldGet(this, _Wizard_nav, "f")), "f");
        // Content page elements
        __classPrivateFieldSet(this, _Wizard_pages, getChildren('.tab-pane', __classPrivateFieldGet(this, _Wizard_container, "f")), "f");
        // Progressbar element(s)
        __classPrivateFieldSet(this, _Wizard_progressbar, getChildren('.progress', __classPrivateFieldGet(this, _Wizard_main, "f")), "f");
        // Direction, RTL/LTR
        __classPrivateFieldSet(this, _Wizard_dir, __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getDir).call(this), "f");
        // Initial index
        __classPrivateFieldSet(this, _Wizard_current_index, -1, "f");
        // Is initialiazed
        __classPrivateFieldSet(this, _Wizard_is_init, false, "f");
        if (autoload) {
            // Initialize options
            this.init();
            // Load asynchronously
            setTimeout(() => {
                this.load();
            }, 0);
        }
    }
    // GETTERS/SETTERS
    get currentIndex() {
        return __classPrivateFieldGet(this, _Wizard_current_index, "f");
    }
    get options() {
        return __classPrivateFieldGet(this, _Wizard_options, "f");
    }
    set options(options) {
        __classPrivateFieldSet(this, _Wizard_options, Object.assign({}, defaultOptions, options), "f");
    }
    // PUBLIC METHODS
    init() {
        // Set the elements
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_setElements).call(this);
        // Add toolbar
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_setToolbar).call(this);
        // Skip if already init
        if (__classPrivateFieldGet(this, _Wizard_is_init, "f") === true)
            return true;
        // Assign events
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_setEvents).call(this);
        __classPrivateFieldSet(this, _Wizard_is_init, true, "f");
        // Trigger the initialized event
        triggerEvent(__classPrivateFieldGet(this, _Wizard_main, "f"), "initialized");
    }
    // load 
    load() {
        // Clean the elements
        hideElement(__classPrivateFieldGet(this, _Wizard_pages, "f"));
        removeClass(`${__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDoneCss} ${__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorActiveCss}`, __classPrivateFieldGet(this, _Wizard_steps, "f"));
        // Initial step index
        __classPrivateFieldSet(this, _Wizard_current_index, -1, "f");
        // Get the initial step index
        // const idx = this.#getStepIndex();
        // Get selected step from the url
        let idx = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getURLHashIndex).call(this);
        idx = idx > -1 ? idx : __classPrivateFieldGet(this, _Wizard_options, "f").selected;
        const idxShowable = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getShowable).call(this, idx - 1, 'forward');
        idx = (idxShowable === null && idx > 0) ? __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getShowable).call(this, -1, 'forward') : idxShowable;
        // Mark any previous steps done
        if (idx > 0 && __classPrivateFieldGet(this, _Wizard_options, "f").anchor.enableDoneState && __classPrivateFieldGet(this, _Wizard_options, "f").anchor.markPreviousStepsAsDone) {
            addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDoneCss, [...__classPrivateFieldGet(this, _Wizard_steps, "f")].slice(0, idx));
        }
        // Show the initial step 
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_showStep).call(this, idx);
        // Trigger loaded event
        triggerEvent(__classPrivateFieldGet(this, _Wizard_main, "f"), "loaded");
    }
    // TODO Remove the fn use setter
    setOptions(options, autoinit = true) {
        __classPrivateFieldSet(this, _Wizard_options, Object.assign({}, __classPrivateFieldGet(this, _Wizard_options, "f"), options), "f");
        !autoinit || this.init();
    }
    next() {
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_navigate).call(this, 'next');
    }
    prev() {
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_navigate).call(this, 'prev');
    }
    goTo(stepIndex) {
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_showStep).call(this, stepIndex);
    }
    reset() {
        // Reset all
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_setURLHash).call(this, '#');
        this.init();
        this.load();
    }
    loader(state) {
        if (state === "show") {
            addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.loaderCss, __classPrivateFieldGet(this, _Wizard_main, "f"));
        }
        else {
            removeClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.loaderCss, __classPrivateFieldGet(this, _Wizard_main, "f"));
        }
    }
}
_Wizard_options = new WeakMap(), _Wizard_main = new WeakMap(), _Wizard_nav = new WeakMap(), _Wizard_container = new WeakMap(), _Wizard_steps = new WeakMap(), _Wizard_pages = new WeakMap(), _Wizard_progressbar = new WeakMap(), _Wizard_dir = new WeakMap(), _Wizard_current_index = new WeakMap(), _Wizard_is_init = new WeakMap(), _Wizard_instances = new WeakSet(), _Wizard_getDir = function _Wizard_getDir() {
    let dir = getAttribute(__classPrivateFieldGet(this, _Wizard_main, "f"), 'dir');
    if (!dir || dir == '') {
        dir = getAttribute(document, 'dir');
        // Help to isolate related css classes
        setAttribute(__classPrivateFieldGet(this, _Wizard_main, "f"), 'dir', dir);
    }
    return dir;
}, _Wizard_setElements = function _Wizard_setElements() {
    // Apply main CSS class
    addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.mainCss, __classPrivateFieldGet(this, _Wizard_main, "f"));
    // Set default theme
    __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_setTheme).call(this, __classPrivateFieldGet(this, _Wizard_options, "f").theme);
    // Set the anchor default style
    if (__classPrivateFieldGet(this, _Wizard_options, "f").anchor.enableNavigationAlways !== true || __classPrivateFieldGet(this, _Wizard_options, "f").anchor.enableNavigation !== true) {
        addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDefaultCss, __classPrivateFieldGet(this, _Wizard_steps, "f"));
    }
    // TODO Remove them maybe
    // Disabled steps
    if (__classPrivateFieldGet(this, _Wizard_options, "f").disabledSteps.length > 0) {
        __classPrivateFieldGet(this, _Wizard_options, "f").disabledSteps.forEach((i) => {
            addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDisabledCss, __classPrivateFieldGet(this, _Wizard_steps, "f").item(i));
        });
    }
    // Error steps
    if (__classPrivateFieldGet(this, _Wizard_options, "f").errorSteps.length > 0) {
        __classPrivateFieldGet(this, _Wizard_options, "f").errorSteps.forEach((i) => {
            addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorErrorCss, __classPrivateFieldGet(this, _Wizard_steps, "f").item(i));
        });
    }
    // Hidden steps
    if (__classPrivateFieldGet(this, _Wizard_options, "f").hiddenSteps.length > 0) {
        __classPrivateFieldGet(this, _Wizard_options, "f").hiddenSteps.forEach((i) => {
            addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorHiddenCss, __classPrivateFieldGet(this, _Wizard_steps, "f").item(i));
        });
    }
}, _Wizard_setTheme = function _Wizard_setTheme(theme) {
    // Remove any themes from class list
    removeClassByPrefix(__classPrivateFieldGet(this, _Wizard_main, "f"), __classPrivateFieldGet(this, _Wizard_options, "f").style.themePrefixCss);
    // Apply theme CSS
    addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.themePrefixCss + theme, __classPrivateFieldGet(this, _Wizard_main, "f"));
}, _Wizard_setEvents = function _Wizard_setEvents() {
    addEvent(__classPrivateFieldGet(this, _Wizard_steps, "f"), "click", (e) => {
        if (__classPrivateFieldGet(this, _Wizard_options, "f").anchor.enableNavigation !== true) {
            return;
        }
        e.preventDefault();
        const elm = e.currentTarget;
        if (__classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_isShowable).call(this, elm)) {
            // Get the step index
            const idx = [...__classPrivateFieldGet(this, _Wizard_steps, "f")].indexOf(elm);
            __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_showStep).call(this, idx);
        }
    });
    // Next/Previous button event
    addEvent(__classPrivateFieldGet(this, _Wizard_main, "f"), "click", (e) => {
        var _a;
        const elm = (_a = e.target) !== null && _a !== void 0 ? _a : e.srcElement;
        if (elm.className.indexOf(__classPrivateFieldGet(this, _Wizard_options, "f").style.btnNextCss) !== -1) {
            e.preventDefault();
            __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_navigate).call(this, 'next');
        }
        else if (elm.className.indexOf(__classPrivateFieldGet(this, _Wizard_options, "f").style.btnPrevCss) !== -1) {
            e.preventDefault();
            __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_navigate).call(this, 'prev');
        }
        return;
    });
    // Keyboard navigation event        
    addEvent(document, "keyup", (e) => {
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_keyNav).call(this, e);
    });
    // Back/forward browser button event
    addEvent(window, "hashchange", (e) => {
        if (!__classPrivateFieldGet(this, _Wizard_options, "f").backButtonSupport) {
            return;
        }
        const idx = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getURLHashIndex).call(this);
        if (idx > -1 && __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_isShowable).call(this, __classPrivateFieldGet(this, _Wizard_steps, "f").item(idx))) {
            e.preventDefault();
            __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_showStep).call(this, idx);
        }
        return;
    });
    addEvent(window, "resize", (e) => {
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_fixHeight).call(this, __classPrivateFieldGet(this, _Wizard_steps, "f").item(__classPrivateFieldGet(this, _Wizard_current_index, "f")));
    });
}, _Wizard_setToolbar = function _Wizard_setToolbar() {
    // TODO: Remove already existing toolbar if any
    // this.main.find(".sw-toolbar-elm").remove();
    const toolbarPosition = __classPrivateFieldGet(this, _Wizard_options, "f").toolbar.position;
    if (toolbarPosition === 'none') {
        // Skip right away if the toolbar is not enabled
        return;
    }
    else if (toolbarPosition == 'both') {
        // Append toolbar based on the position
        prependElement(__classPrivateFieldGet(this, _Wizard_container, "f"), __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_createToolbar).call(this, 'top'));
        appendElement(__classPrivateFieldGet(this, _Wizard_container, "f"), __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_createToolbar).call(this, 'bottom'));
    }
    else if (toolbarPosition == 'top') {
        prependElement(__classPrivateFieldGet(this, _Wizard_container, "f"), __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_createToolbar).call(this, 'top'));
    }
    else {
        appendElement(__classPrivateFieldGet(this, _Wizard_container, "f"), __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_createToolbar).call(this, 'bottom'));
    }
}, _Wizard_createToolbar = function _Wizard_createToolbar(position) {
    const btnNext = __classPrivateFieldGet(this, _Wizard_options, "f").toolbar.showNextButton !== false ? `<button class="btn ${__classPrivateFieldGet(this, _Wizard_options, "f").style.btnCss} ${__classPrivateFieldGet(this, _Wizard_options, "f").style.btnNextCss}" type="button">${__classPrivateFieldGet(this, _Wizard_options, "f").lang.next}</button>` : '';
    const btnPrev = __classPrivateFieldGet(this, _Wizard_options, "f").toolbar.showNextButton !== false ? `<button class="btn ${__classPrivateFieldGet(this, _Wizard_options, "f").style.btnCss} ${__classPrivateFieldGet(this, _Wizard_options, "f").style.btnPrevCss}" type="button">${__classPrivateFieldGet(this, _Wizard_options, "f").lang.previous}</button>` : '';
    // Create the toolbar buttons and add extra toolbar html
    const toolbar = document.createElement('div');
    toolbar.innerHTML = `${btnPrev}${btnNext}${__classPrivateFieldGet(this, _Wizard_options, "f").toolbar.extraHtml}`;
    addClass("toolbar toolbar-" + position, toolbar);
    setAttribute(toolbar, 'role', 'toolbar');
    return toolbar;
}, _Wizard_navigate = function _Wizard_navigate(dir) {
    __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_showStep).call(this, __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getShowable).call(this, __classPrivateFieldGet(this, _Wizard_current_index, "f"), dir !== null && dir !== void 0 ? dir : 'next'));
}, _Wizard_showStep = function _Wizard_showStep(idx) {
    if (idx === -1 || idx === null)
        return false;
    // If current step is requested again, skip
    if (idx == __classPrivateFieldGet(this, _Wizard_current_index, "f"))
        return false;
    // If step not found, skip
    if (!__classPrivateFieldGet(this, _Wizard_steps, "f").item(idx))
        return false;
    // If it is a disabled step, skip
    if (!__classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_isEnabled).call(this, __classPrivateFieldGet(this, _Wizard_steps, "f").item(idx)))
        return false;
    // Get the direction of navigation
    const stepDirection = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getStepDirection).call(this, idx);
    // Get the direction of step navigation
    if (__classPrivateFieldGet(this, _Wizard_current_index, "f") !== -1) {
        // Trigger "leaveStep" event
        if (triggerEvent(__classPrivateFieldGet(this, _Wizard_main, "f"), "leaveStep", [__classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getAnchor).call(this, __classPrivateFieldGet(this, _Wizard_current_index, "f")), __classPrivateFieldGet(this, _Wizard_current_index, "f"), idx, stepDirection]) === false) {
            return false;
        }
    }
    // Load the content of the step
    __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_loadContent).call(this, idx, () => {
        // Get step to show element
        const selStep = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getAnchor).call(this, idx);
        // Change the url hash to new step
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_setURLHash).call(this, getAttribute(selStep, "href"));
        // Update controls
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_setAnchor).call(this, idx);
        // Get current step element
        const curPage = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getPage).call(this, __classPrivateFieldGet(this, _Wizard_current_index, "f"));
        // Get next step element
        const selPage = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getPage).call(this, idx);
        // transit the step
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_transit).call(this, selPage, curPage, stepDirection, () => {
            // Update the current index
            __classPrivateFieldSet(this, _Wizard_current_index, idx, "f");
            // Fix height with content
            __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_fixHeight).call(this, selPage);
            // Set the buttons based on the step
            __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_setButtons).call(this, idx);
            // Set the progressbar based on the step
            __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_setProgressbar).call(this, idx);
            // Trigger "showStep" event
            triggerEvent(__classPrivateFieldGet(this, _Wizard_main, "f"), "showStep", [selStep, idx, stepDirection, __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getStepPosition).call(this, idx)]);
        });
    });
}, _Wizard_loadContent = function _Wizard_loadContent(idx, callback) {
    if (!__classPrivateFieldGet(this, _Wizard_options, "f").getContent || typeof __classPrivateFieldGet(this, _Wizard_options, "f").getContent !== "function") {
        callback();
        return;
    }
    const selPage = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getPage).call(this, idx);
    if (!selPage) {
        callback();
        return;
    }
    // Get step direction
    const stepDirection = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getStepDirection).call(this, idx);
    // Get step position
    const stepPosition = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getStepPosition).call(this, idx);
    // Get next step element
    const selStep = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getAnchor).call(this, idx);
    // Call the get content function
    __classPrivateFieldGet(this, _Wizard_options, "f").getContent(idx, stepDirection, stepPosition, selStep, (content) => {
        if (content)
            setHtml(selPage, content);
        callback();
    });
}, _Wizard_transit = function _Wizard_transit(elmToShow, elmToHide, stepDirection, callback) {
    const transitFn = this.transitions[__classPrivateFieldGet(this, _Wizard_options, "f").transition.animation];
    if (transitFn && typeof transitFn === "function") {
        transitFn(elmToShow, elmToHide, stepDirection, this, (res) => {
            if (res === false) {
                elmToHide == null || hideElement(elmToHide);
                showElement(elmToShow);
            }
            callback();
        });
    }
    else {
        elmToHide == null || hideElement(elmToHide);
        showElement(elmToShow);
        callback();
    }
}, _Wizard_fixHeight = function _Wizard_fixHeight(elm) {
    // Auto adjust height of the container
    if (__classPrivateFieldGet(this, _Wizard_options, "f").autoAdjustHeight) {
        setElementHeight(__classPrivateFieldGet(this, _Wizard_container, "f"), getElementHeight(elm));
    }
}, _Wizard_setProgressbar = function _Wizard_setProgressbar(idx) {
    if (__classPrivateFieldGet(this, _Wizard_progressbar, "f").length > 0) {
        const width = getElementWidth(__classPrivateFieldGet(this, _Wizard_progressbar, "f")[0]);
        const widthPercentage = ((width / __classPrivateFieldGet(this, _Wizard_steps, "f").length) * (idx + 1) / width) * 100;
        applyTo(__classPrivateFieldGet(this, _Wizard_progressbar, "f"), (el) => {
            setElementWidth(findElement('.progress-bar', el), widthPercentage + '%');
        });
    }
}, _Wizard_setAnchor = function _Wizard_setAnchor(idx) {
    // Current step anchor > Remove other classes and add done class
    const curStep = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getAnchor).call(this, __classPrivateFieldGet(this, _Wizard_current_index, "f"));
    removeClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorActiveCss, curStep);
    if (__classPrivateFieldGet(this, _Wizard_options, "f").anchor.enableDoneState !== false && __classPrivateFieldGet(this, _Wizard_current_index, "f") !== -1) {
        addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDoneCss, curStep);
        if (__classPrivateFieldGet(this, _Wizard_options, "f").anchor.unDoneOnBackNavigation !== false && __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getStepDirection).call(this, idx) === 'backward') {
            removeClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDoneCss, curStep);
        }
    }
    // Next step anchor > Remove other classes and add active class
    const selStep = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getAnchor).call(this, idx);
    removeClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDoneCss, selStep);
    addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorActiveCss, selStep);
}, _Wizard_setURLHash = function _Wizard_setURLHash(hash) {
    if (__classPrivateFieldGet(this, _Wizard_options, "f").enableUrlHash && window.location.hash !== hash) {
        history.pushState(null, '', hash);
    }
}, _Wizard_getStepDirection = function _Wizard_getStepDirection(idx) {
    if (__classPrivateFieldGet(this, _Wizard_current_index, "f") == -1)
        return '';
    return __classPrivateFieldGet(this, _Wizard_current_index, "f") < idx ? "forward" : "backward";
}, _Wizard_getStepPosition = function _Wizard_getStepPosition(idx) {
    if (idx === 0) {
        return 'first';
    }
    else if (idx === __classPrivateFieldGet(this, _Wizard_steps, "f").length - 1) {
        return 'last';
    }
    return 'middle';
}, _Wizard_isEnabled = function _Wizard_isEnabled(elm) {
    return (hasClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDisabledCss, elm) || hasClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorHiddenCss, elm)) ? false : true;
}, _Wizard_isShowable = function _Wizard_isShowable(elm) {
    if (__classPrivateFieldGet(this, _Wizard_options, "f").anchor.enableDoneStateNavigation === false && __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_isDone).call(this, elm)) {
        return false;
    }
    if (__classPrivateFieldGet(this, _Wizard_options, "f").anchor.enableNavigationAlways === false && !__classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_isDone).call(this, elm)) {
        return false;
    }
    if (!__classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_isEnabled).call(this, elm)) {
        return false;
    }
    return true;
}, _Wizard_getAnchor = function _Wizard_getAnchor(idx) {
    if (idx == null) {
        return null;
    }
    return __classPrivateFieldGet(this, _Wizard_steps, "f").item(idx);
}, _Wizard_getPage = function _Wizard_getPage(idx) {
    if (idx == null) {
        return null;
    }
    return __classPrivateFieldGet(this, _Wizard_pages, "f").item(idx);
}, _Wizard_isDone = function _Wizard_isDone(elm) {
    return hasClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDoneCss, elm);
}, _Wizard_getURLHashIndex = function _Wizard_getURLHashIndex() {
    if (__classPrivateFieldGet(this, _Wizard_options, "f").enableUrlHash) {
        // Get step number from url hash if available
        var hash = window.location.hash;
        if (hash.length > 0) {
            const idx = [...__classPrivateFieldGet(this, _Wizard_steps, "f")].indexOf(findElement("a[href*='" + hash + "']", __classPrivateFieldGet(this, _Wizard_nav, "f")));
            return idx > -1 && idx < __classPrivateFieldGet(this, _Wizard_steps, "f").length ? idx : -1;
        }
    }
    return -1;
}, _Wizard_getShowable = function _Wizard_getShowable(idx, navDir) {
    let si = null;
    const elmList = (navDir == 'prev') ? [...__classPrivateFieldGet(this, _Wizard_steps, "f")].slice(0, idx).reverse() : [...__classPrivateFieldGet(this, _Wizard_steps, "f")].slice(idx + 1);
    // Find the next showable step in the direction
    const i = elmList.findIndex(elm => __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_isEnabled).call(this, elm) === true);
    si = (navDir == 'prev') ? idx - (i + 1) : i + idx + 1;
    if (si !== null && (navDir == 'prev' && 0 > si) || (navDir == 'next' && __classPrivateFieldGet(this, _Wizard_steps, "f").length <= si)) {
        si = (navDir == 'prev') ? __classPrivateFieldGet(this, _Wizard_steps, "f").length - 1 : 0;
    }
    return si;
}, _Wizard_setButtons = function _Wizard_setButtons(idx) {
    // Previous/Next Button enable/disable based on step
    removeClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDisabledCss, findElements('.' + __classPrivateFieldGet(this, _Wizard_options, "f").style.btnCss, __classPrivateFieldGet(this, _Wizard_main, "f")));
    const p = __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getStepPosition).call(this, idx);
    if (p === 'middle') {
        if (__classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getShowable).call(this, idx, 'next') === null) {
            addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDisabledCss, findElements('.' + __classPrivateFieldGet(this, _Wizard_options, "f").style.btnNextCss, __classPrivateFieldGet(this, _Wizard_main, "f")));
        }
        if (__classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_getShowable).call(this, idx, 'prev') === null) {
            addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDisabledCss, findElements('.' + __classPrivateFieldGet(this, _Wizard_options, "f").style.btnPrevCss, __classPrivateFieldGet(this, _Wizard_main, "f")));
        }
    }
    else {
        const c = '.' + ((p === 'first') ? __classPrivateFieldGet(this, _Wizard_options, "f").style.btnPrevCss : __classPrivateFieldGet(this, _Wizard_options, "f").style.btnNextCss);
        addClass(__classPrivateFieldGet(this, _Wizard_options, "f").style.anchorDisabledCss, findElements(c, __classPrivateFieldGet(this, _Wizard_main, "f")));
    }
}, _Wizard_keyNav = function _Wizard_keyNav(e) {
    if (!__classPrivateFieldGet(this, _Wizard_options, "f").keyboard.keyNavigation) {
        return;
    }
    // Keyboard navigation
    if (__classPrivateFieldGet(this, _Wizard_options, "f").keyboard.keyLeft.includes(e.which)) {
        // left
        e.preventDefault();
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_navigate).call(this, 'prev');
    }
    else if (__classPrivateFieldGet(this, _Wizard_options, "f").keyboard.keyRight.includes(e.which)) {
        // right
        e.preventDefault();
        __classPrivateFieldGet(this, _Wizard_instances, "m", _Wizard_navigate).call(this, 'next');
    }
    return; // exit this handler for other keys
};

exports.createWizard = Wizard;
