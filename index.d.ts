declare class Step {
    title: string;
    dropdowns: Dropdown[];
    constructor(title: string);
    addQuestion(question: Dropdown): void;
    get isValid(): boolean;
}
declare class Dropdown {
    value: string;
    label: string;
    placeholder: string;
    options: SelectOption[];
    validOptions: string[];
    error: string;
    constructor(label: string, placeholder?: string, value?: string);
    addOption(option: SelectOption): void;
    select(optionValue: string): void;
    get isValid(): boolean;
}
declare class SelectOption {
    label: string;
    value: string;
    constructor(label: any, value: any);
}
declare function fetchFormMetadata(): Promise<any>;
declare function main(): Promise<void>;
declare function renderOption(where: Node, option: SelectOption): void;
declare function renderDropdown(where: Node, dropdown: Dropdown): void;
declare function renderStep(where: Node, step: Step): void;
declare function formatId(text: string): string;
