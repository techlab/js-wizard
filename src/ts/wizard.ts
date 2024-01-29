import { 
    getChildren,
    findElement,
    findElements,
    getFirstDescendant,
    addClass,
    removeClass,
    hasClass,
    hideElement,
    addEvent,
    triggerEvent,
    getAttribute,
    setAttribute,
    appendElement,
    prependElement,
    getElement,
    //-----------
    showElement,
    applyTo,
    removeClassByPrefix,
    setHtml,
    getElementHeight,
    setElementHeight,
    setElementWidth,
    getElementWidth,
} from './util';

import { defaultOptions } from './options';
import { transitions } from './transitions';

export class Wizard {
    // Private properties
    #options:any;
    #main:HTMLElement;
    #nav:HTMLElement;
    #container:HTMLElement;
    #steps:any;
    #pages:any;
    #progressbar:any;
    #dir:string|null;
    #current_index:number;
    #is_init:boolean;

    // Public properties
    public transitions:Transitions = transitions;

    constructor(selector:string, options:object = {}, autoload:boolean = true) {
        // Merge user options with default options
        this.options        = options;
        // Main element
        this.#main          = getElement(selector);
        // Navigation bar element
        this.#nav           = getFirstDescendant('.nav', this.#main);
        // Content container element
        this.#container     = getFirstDescendant('.tab-content', this.#main);
        // Anchor elements
        this.#steps         = getChildren('.nav-link', this.#nav);
        // Content page elements
        this.#pages         = getChildren('.tab-pane', this.#container);
        // Progressbar element(s)
        this.#progressbar   = getChildren('.progress', this.#main);
        // Direction, RTL/LTR
        this.#dir           = this.#getDir();
        // Initial index
        this.#current_index = -1;
        // Is initialiazed
        this.#is_init       = false;

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
        return this.#current_index;
    }

    get options() {
        return this.#options;
    }

    set options(options:object) {
        this.#options = Object.assign({}, defaultOptions, options);
    }

    // PUBLIC METHODS

    init() {
        // Set the elements
        this.#setElements();
        // Add toolbar
        this.#setToolbar();

        // Skip if already init
        if (this.#is_init === true) return true;

        // Assign events
        this.#setEvents();

        this.#is_init = true;
        // Trigger the initialized event
        triggerEvent(this.#main, "initialized");
    }

    // load 
    load() {
        // Clean the elements
        hideElement(this.#pages);
        removeClass(`${this.#options.style.anchorDoneCss} ${this.#options.style.anchorActiveCss}`, this.#steps);
        
        // Initial step index
        this.#current_index  = -1;

        // Get the initial step index
        // const idx = this.#getStepIndex();
        // Get selected step from the url
        let idx = this.#getURLHashIndex();
        idx = idx > -1 ? idx : this.#options.selected;
        const idxShowable = this.#getShowable(idx - 1, 'forward');
        idx = (idxShowable === null && idx > 0) ? this.#getShowable(-1, 'forward') : idxShowable;
        
        // Mark any previous steps done
        if (idx > 0 && this.#options.anchor.enableDoneState && this.#options.anchor.markPreviousStepsAsDone) {
            addClass(this.#options.style.anchorDoneCss, [...this.#steps].slice(0, idx));
        }
        
        // Show the initial step 
        this.#showStep(idx);
        
        // Trigger loaded event
        triggerEvent(this.#main, "loaded");
    }

    // TODO Remove the fn use setter
    setOptions(options:object, autoinit:boolean = true) {
        this.#options = Object.assign({}, this.#options, options);
        !autoinit || this.init()
    }

    next() {
        this.#navigate('next')
    }

    prev() {
        this.#navigate('prev')
    }

    goTo(stepIndex:number) {
        this.#showStep(stepIndex);
    }

    reset() {
        // Reset all
        this.#setURLHash('#');
        this.init();
        this.load();
    }

    loader(state:string) {
        if (state === "show") {
            addClass(this.#options.style.loaderCss, this.#main)
        } else {
            removeClass(this.#options.style.loaderCss, this.#main)
        }
    }

    // PRIVATE METHODS

    #getDir() {
        let dir = getAttribute(this.#main, 'dir');
        if (!dir || dir == '') {
            dir = getAttribute(document, 'dir');
            // Help to isolate related css classes
            setAttribute(this.#main, 'dir', dir);
        }
        return dir;
    }

    #setElements() {
        // Apply main CSS class
        addClass(this.#options.style.mainCss, this.#main);
        
        // Set default theme
        this.#setTheme(this.#options.theme);

        // Set the anchor default style
        if (this.#options.anchor.enableNavigationAlways !== true || this.#options.anchor.enableNavigation !== true) {
            addClass(this.#options.style.anchorDefaultCss, this.#steps);
        }

        // TODO Remove them maybe
        // Disabled steps
        if (this.#options.disabledSteps.length > 0) {
            this.#options.disabledSteps.forEach((i:number) => {
                addClass(this.#options.style.anchorDisabledCss, this.#steps.item(i));
            });
        }
        // Error steps
        if (this.#options.errorSteps.length > 0) {
            this.#options.errorSteps.forEach((i:number) => {
                addClass(this.#options.style.anchorErrorCss, this.#steps.item(i));
            });
        }
        // Hidden steps
        if (this.#options.hiddenSteps.length > 0) {
            this.#options.hiddenSteps.forEach((i:number) => {
                addClass(this.#options.style.anchorHiddenCss, this.#steps.item(i));
            });
        }
    }

    #setTheme(theme:string) {
        // Remove any themes from class list
        removeClassByPrefix(this.#main, this.#options.style.themePrefixCss);
        // Apply theme CSS
        addClass(this.#options.style.themePrefixCss + theme, this.#main);
    }

    #setEvents() {
        addEvent(this.#steps, "click", (e:Event) => {
            if (this.#options.anchor.enableNavigation !== true) {
                return;
            }

            e.preventDefault();

            const elm = <HTMLElement> e.currentTarget;
            if (this.#isShowable(elm)) {
                // Get the step index
                const idx = [...this.#steps].indexOf(elm);
                this.#showStep(idx);
            }
        })

        // Next/Previous button event
        addEvent(this.#main, "click", (e:any) => {
            const elm = e.target ?? e.srcElement;
            if (elm.className.indexOf(this.#options.style.btnNextCss) !== -1) {
                e.preventDefault();
                this.#navigate('next');
            } else if (elm.className.indexOf(this.#options.style.btnPrevCss) !== -1) {
                e.preventDefault();
                this.#navigate('prev');
            }
            return;
        });

        // Keyboard navigation event        
        addEvent(document, "keyup", (e:Event) => {
            this.#keyNav(e);
        });

        // Back/forward browser button event
        addEvent(window, "hashchange", (e:Event) => {
            if (!this.#options.backButtonSupport) {
                return;
            }

            const idx = this.#getURLHashIndex();
            if (idx > -1 && this.#isShowable(this.#steps.item(idx))) {
                e.preventDefault();
                this.#showStep(idx);
            }
            return;
        });

        addEvent(window, "resize", (e:Event) => {
            this.#fixHeight(this.#steps.item(this.#current_index));
        });
    }

    #setToolbar() {
        // TODO: Remove already existing toolbar if any
        // this.main.find(".sw-toolbar-elm").remove();

        const toolbarPosition = this.#options.toolbar.position
        if (toolbarPosition === 'none') {
            // Skip right away if the toolbar is not enabled
            return;
        } else if (toolbarPosition == 'both') {
            // Append toolbar based on the position
            prependElement(this.#container, this.#createToolbar('top'));
            appendElement(this.#container, this.#createToolbar('bottom'));
        } else if (toolbarPosition == 'top') {
            prependElement(this.#container, this.#createToolbar('top'));
        } else {
            appendElement(this.#container, this.#createToolbar('bottom'));
        }
    }

    #createToolbar(position:string) {
        const btnNext   = this.#options.toolbar.showNextButton !== false ? `<button class="btn ${this.#options.style.btnCss} ${this.#options.style.btnNextCss}" type="button">${this.#options.lang.next}</button>` : '';
        const btnPrev   = this.#options.toolbar.showNextButton !== false ? `<button class="btn ${this.#options.style.btnCss} ${this.#options.style.btnPrevCss}" type="button">${this.#options.lang.previous}</button>` : '';
        // Create the toolbar buttons and add extra toolbar html
        const toolbar = document.createElement('div');
        toolbar.innerHTML = `${btnPrev}${btnNext}${this.#options.toolbar.extraHtml}`;
        addClass("toolbar toolbar-" + position, toolbar);
        setAttribute(toolbar, 'role', 'toolbar');
        return toolbar;
    }

    #navigate(dir:string) {
        this.#showStep(this.#getShowable(this.#current_index, dir ?? 'next'));
    }

    #showStep(idx:number) {
        if (idx === -1 || idx === null) return false;

        // If current step is requested again, skip
        if (idx == this.#current_index) return false;

        // If step not found, skip
        if (!this.#steps.item(idx)) return false;

        // If it is a disabled step, skip
        if (!this.#isEnabled(this.#steps.item(idx))) return false;

        // Get the direction of navigation
        const stepDirection = this.#getStepDirection(idx);

        // Get the direction of step navigation
        if (this.#current_index !== -1) {
            // Trigger "leaveStep" event
            if (triggerEvent(this.#main, "leaveStep", [this.#getAnchor(this.#current_index), this.#current_index, idx, stepDirection]) === false) {
                return false;
            }
        }

        // Load the content of the step
        this.#loadContent(idx, () => {
            // Get step to show element
            const selStep = this.#getAnchor(idx);
            // Change the url hash to new step
            this.#setURLHash(getAttribute(selStep, "href"));
            // Update controls
            this.#setAnchor(idx);

            // Get current step element
            const curPage   = this.#getPage(this.#current_index);
            // Get next step element
            const selPage   = this.#getPage(idx);
            // transit the step
            this.#transit(selPage, curPage, stepDirection, () => {
                // Update the current index
                this.#current_index  = idx;
                // Fix height with content
                this.#fixHeight(selPage);
                // Set the buttons based on the step
                this.#setButtons(idx);
                // Set the progressbar based on the step
                this.#setProgressbar(idx);
                // Trigger "showStep" event
                triggerEvent(this.#main, "showStep", [selStep, idx, stepDirection, this.#getStepPosition(idx)]);
            });
        });
    }

    #loadContent(idx:number, callback:Function) {
        if(!this.#options.getContent || typeof this.#options.getContent !== "function") {
            callback();
            return;
        }

        const selPage = this.#getPage(idx);
        if (!selPage) { 
            callback();
            return;
        }

        // Get step direction
        const stepDirection = this.#getStepDirection(idx);
        // Get step position
        const stepPosition  = this.#getStepPosition(idx);
        // Get next step element
        const selStep       = this.#getAnchor(idx);
        // Call the get content function
        this.#options.getContent(idx, stepDirection, stepPosition, selStep, (content:any) => {
            if (content) setHtml(selPage, content);
            callback();
        });
    } 

    #transit(elmToShow:HTMLElement, elmToHide:HTMLElement|null, stepDirection:string, callback:Function) {
        const transitFn = this.transitions[this.#options.transition.animation as string];
        if (transitFn && typeof transitFn === "function") {
            transitFn(elmToShow, elmToHide, stepDirection, this, (res:any) => {
                if (res === false) {
                    elmToHide == null || hideElement(elmToHide);
                    showElement(elmToShow);
                }
                callback();
            });
        } else {
            elmToHide == null || hideElement(elmToHide);
            showElement(elmToShow);
            callback();
        }
    }

    #transit2(idx:number) {
        // Get step to show element
        const selStep       = this.#getAnchor(idx);
        // Change the url hash to new step
        this.#setURLHash(getAttribute(selStep, "href"));
        // Update controls
        this.#setAnchor(idx);

        // Animate the step
        const currPage  = this.#getPage(this.#current_index);
        const nextPage  = this.#getPage(idx);
        const transitFn = transitions[this.#options.transition.name as keyof typeof transitions];
        if (transitFn instanceof Function) {
            transitFn(nextPage, currPage, () => {
                // Fix height with content
                this.#fixHeight(nextPage);
                // Trigger "showStep" event
                triggerEvent(this.#main, "showStep", [selStep, this.#current_index, this.#getStepDirection(idx), this.#getStepPosition(idx)]);
            });
        } else {
            currPage == null || hideElement(currPage);
            showElement(nextPage)

            // Fix height with content
            this.#fixHeight(nextPage);
            // Trigger "showStep" event
            triggerEvent(this.#main, "showStep", [selStep, this.#current_index, this.#getStepDirection(idx), this.#getStepPosition(idx)]);
        }

        // Update the current index
        this.#current_index  = idx;
        // Set the buttons based on the step
        this.#setButtons(idx);
        // Set the progressbar based on the step
        this.#setProgressbar(idx);
    }

    #fixHeight(elm:HTMLElement) {
        // Auto adjust height of the container
        if (this.#options.autoAdjustHeight) {
            setElementHeight(this.#container, getElementHeight(elm));
        }
    }

    #setProgressbar(idx:number) {
        if (this.#progressbar.length > 0) {
            const width = getElementWidth(this.#progressbar[0]);
            const widthPercentage = ((width / this.#steps.length) * (idx + 1) / width) * 100;
            applyTo(this.#progressbar, (el:Element) => {
                setElementWidth(findElement('.progress-bar', el), widthPercentage + '%')
            })
        }
    }

    #setAnchor(idx:number) {
        // Current step anchor > Remove other classes and add done class
        const curStep       = this.#getAnchor(this.#current_index);
        removeClass(this.#options.style.anchorActiveCss, curStep);
        
        if (this.#options.anchor.enableDoneState !== false && this.#current_index !== -1) {
            addClass(this.#options.style.anchorDoneCss, curStep);
            if (this.#options.anchor.unDoneOnBackNavigation !== false && this.#getStepDirection(idx) === 'backward') {
                removeClass(this.#options.style.anchorDoneCss, curStep);
            }
        }

        // Next step anchor > Remove other classes and add active class
        const selStep       = this.#getAnchor(idx);
        removeClass(this.#options.style.anchorDoneCss, selStep);
        addClass(this.#options.style.anchorActiveCss, selStep);
    }

    #setURLHash(hash:string) {
        if (this.#options.enableUrlHash && window.location.hash !== hash) {
            history.pushState(null, '', hash);
        }
    }

    #getStepDirection(idx:number) {
        if (this.#current_index == -1) return '';
        return this.#current_index < idx ? "forward" : "backward";
    }

    #getStepPosition(idx:number) {
        if (idx === 0) {
            return 'first';
        } else if (idx === this.#steps.length - 1) {
            return 'last';
        }
        return 'middle';
    }

    #isEnabled(elm:Element) {
        return (hasClass(this.#options.style.anchorDisabledCss, elm) || hasClass(this.#options.style.anchorHiddenCss, elm)) ? false : true;
    }

    #isShowable(elm:Element) {
        if (this.#options.anchor.enableDoneStateNavigation === false && this.#isDone(elm)) {
            return false;
        }

        if (this.#options.anchor.enableNavigationAlways === false && !this.#isDone(elm)) {
            return false;
        }

        if (!this.#isEnabled(elm)) {
            return false;
        }

        return true;
    }

    #getAnchor(idx:number) {
        if (idx == null) {
            return null;
        }
        return this.#steps.item(idx);
    }

    #getPage(idx:number) {
        if (idx == null) {
            return null;
        }
        return this.#pages.item(idx);
    }

    #isDone(elm:HTMLElement|any) {
        return hasClass(this.#options.style.anchorDoneCss, elm);
    }

    #getURLHashIndex() {
        if (this.#options.enableUrlHash) {
            // Get step number from url hash if available
            var hash = window.location.hash;
            if (hash.length > 0) {
                const idx = [...this.#steps].indexOf(findElement("a[href*='" + hash + "']", this.#nav));
                return idx > -1 && idx < this.#steps.length ? idx : -1;
            }
        }
        return -1;
    }

    #getShowable(idx:number, navDir:string) {
        let si = null;
        const elmList = (navDir == 'prev') ? [...this.#steps].slice(0, idx).reverse() : [...this.#steps].slice(idx + 1);
        // Find the next showable step in the direction
        const i = elmList.findIndex(elm => this.#isEnabled(elm) === true);
        si = (navDir == 'prev') ? idx - (i + 1) : i + idx + 1;

        if (si !== null && (navDir == 'prev' && 0 > si) || (navDir == 'next' && this.#steps.length <= si)) {
            si = (navDir == 'prev') ? this.#steps.length - 1 : 0;
        }
        return si;
    }

    #setButtons(idx:number) {
        // Previous/Next Button enable/disable based on step
        removeClass(this.#options.style.anchorDisabledCss, findElements('.' + this.#options.style.btnCss, this.#main))

        const p = this.#getStepPosition(idx);
        if (p === 'middle') {
            if (this.#getShowable(idx, 'next') === null) {
                addClass(this.#options.style.anchorDisabledCss, findElements('.' + this.#options.style.btnNextCss, this.#main));
            }
            if (this.#getShowable(idx, 'prev') === null) {
                addClass(this.#options.style.anchorDisabledCss, findElements('.' + this.#options.style.btnPrevCss, this.#main));
            }
        } else {
            const c = '.' + ((p === 'first') ? this.#options.style.btnPrevCss : this.#options.style.btnNextCss);
            addClass(this.#options.style.anchorDisabledCss, findElements(c, this.#main));
        }
    }

    #keyNav(e:any) {
        if (!this.#options.keyboard.keyNavigation) {
            return;
        }

        // Keyboard navigation
        if (this.#options.keyboard.keyLeft.includes(e.which)) {
            // left
            e.preventDefault();
            this.#navigate('prev');
        } else if (this.#options.keyboard.keyRight.includes(e.which)) {
            // right
            e.preventDefault();
            this.#navigate('next');
        }
        return; // exit this handler for other keys
    }

}