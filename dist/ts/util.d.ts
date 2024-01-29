export declare const applyTo: (value: any, cb: Function) => void;
export declare const getElement: (selector: string) => HTMLElement;
export declare const getElementById: (id: string) => HTMLElement | null;
export declare const getChildren: (selector: string, root?: any) => any;
export declare const findElement: (selector: string, root?: any) => any;
export declare const findElements: (selector: string, root?: any) => any;
export declare const getFirstDescendant: (selector: string, root?: any) => any;
export declare const addClass: (className: string, element: any) => void;
export declare const removeClass: (className: string, element: any) => void;
export declare const removeClassByPrefix: (element: any, classNamePrefix: string) => void;
export declare const hasClass: (className: string, element: any) => any;
export declare const logMessage: (msg: string, type?: string) => void;
export declare const hideElement: (element: any) => void;
export declare const showElement: (element: any) => void;
export declare const addEvent: (element: HTMLElement | any, event: keyof HTMLElementEventMap | keyof WindowEventMap, listener: any) => void;
export declare const triggerEvent: (el: HTMLElement, eventName: string, data?: {}) => boolean;
export declare const getAttribute: (el: HTMLElement | any, attributeName: string) => any;
export declare const setAttribute: (el: HTMLElement, attributeName: string, value: string) => void;
export declare const getElementWidth: (element: HTMLElement) => number;
export declare const getElementHeight: (element: HTMLElement) => number;
export declare const setElementWidth: (element: HTMLElement, val: string) => void;
export declare const setElementHeight: (element: HTMLElement, val: any) => void;
export declare const setHtml: (element: HTMLElement, content: string) => void;
export declare const appendHTML: (element: HTMLElement, content: string) => void;
export declare const prependHTML: (element: HTMLElement, content: string) => void;
export declare const appendElement: (element: HTMLElement, content: HTMLElement) => void;
export declare const prependElement: (element: HTMLElement, content: HTMLElement) => void;
