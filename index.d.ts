declare type OptionStruct = {
    value: string;
    label: string;
};
declare class Stepper {
    constructor(where: Node);
    render(where: Node): void;
}
declare class DisplayStep {
    element: HTMLElement;
    constructor(where: Node, step: Step);
}
declare class DisplayDropdown {
    element: HTMLSelectElement;
    dropdown: Dropdown;
    error: HTMLSpanElement;
    constructor(where: Node, dropdown: Dropdown);
    private listenChange;
    displayError(string: any): void;
    clearError(): void;
}
declare class DisplayOption {
    element: HTMLElement;
    constructor(where: Node, label: string, value: string);
}
declare class Step {
    title: string;
    dropdowns: Dropdown[];
    displayed: DisplayStep;
    constructor(parent: HTMLElement, title: string);
    addQuestion(label: string, options: {
        label: string;
        value: string;
    }[]): void;
    get isValid(): boolean;
    private render;
}
declare class Dropdown {
    value: string;
    label: string;
    placeholder: string;
    options: SelectOption[];
    validOptions: string[];
    error: string;
    displayed: DisplayDropdown;
    constructor(where: HTMLElement, label: string, options: {
        label: string;
        value: string;
    }[]);
    addOption(label: string, value: string): void;
    select(optionValue: string): void;
    get isValid(): boolean;
    render(where: HTMLElement): void;
}
declare class SelectOption {
    label: string;
    value: string;
    constructor(where: HTMLSelectElement, label: string, value: string);
    render(where: HTMLElement): void;
}
declare function fetchFormMetadata(): Promise<any>;
declare function main(): Promise<void>;
declare function formatId(text: string): string;
