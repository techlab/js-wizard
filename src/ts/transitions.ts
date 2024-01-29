import {
    hideElement,
    showElement,
} from './util'

declare global {
    type Transitions = { [key: string]: Function };
}

export const transitions: Transitions = {
    default: (elmToShow:HTMLElement, elmToHide:HTMLElement|null, callback:Function) => {
        elmToHide == null || hideElement(elmToHide);
        showElement(elmToShow);
        callback();
    },

    fade: (elmToShow:HTMLElement, elmToHide:HTMLElement|null, callback:Function) => {
        const fadeIn = ((element:HTMLElement) => {
            var op = 0.1;  // initial opacity
            element.style.display = 'block';
            var timer = setInterval(() => {
                if (op >= 1){
                    clearInterval(timer);
                    callback();
                }
                element.style.opacity = op.toString();
                element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                op += op * 0.1;
            }, 10);
        });
        
        if (elmToHide !== null ) {
            ((element:HTMLElement) => {
                var op = 1;  // initial opacity
                var timer = setInterval(() => {
                    if (op <= 0.1){
                        clearInterval(timer);
                        element.style.display = 'none';
                        fadeIn(elmToShow);
                    }
                    element.style.opacity = op.toString();
                    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op -= op * 0.1;
                }, 10);
            })(elmToHide);
        } else {
            fadeIn(elmToShow);
        }
    },

    css: (elmToShow:HTMLElement, elmToHide:HTMLElement|null, callback:Function) => {
        elmToHide == null || hideElement(elmToHide);
        showElement(elmToShow);
        callback();
    },
};

// export default transitions;