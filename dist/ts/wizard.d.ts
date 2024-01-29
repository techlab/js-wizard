export declare class Wizard {
    #private;
    transitions: Transitions;
    constructor(selector: string, options?: object, autoload?: boolean);
    get currentIndex(): number;
    get options(): object;
    set options(options: object);
    init(): true | undefined;
    load(): void;
    setOptions(options: object, autoinit?: boolean): void;
    next(): void;
    prev(): void;
    goTo(stepIndex: number): void;
    reset(): void;
    loader(state: string): void;
}
