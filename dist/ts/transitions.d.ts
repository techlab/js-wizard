declare global {
    type Transitions = {
        [key: string]: Function;
    };
}
export declare const transitions: Transitions;
