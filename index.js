class Step {
    constructor(title) {
        this.dropdowns = [];
        this.title = title;
    }
    addQuestion(question) {
        this.dropdowns.push(question);
    }
    get isValid() {
        return this.dropdowns.reduce(function isValid(pre, cur) {
            return cur.isValid ? pre : cur.isValid;
        }, true);
    }
}
class Dropdown {
    constructor(label, placeholder = "", value = "") {
        this.options = [];
        this.validOptions = [];
        this.label = label;
        this.placeholder = placeholder;
        this.value = value;
    }
    addOption(option) {
        this.options.push(option);
    }
    select(optionValue) {
        if (!this.validOptions.includes(optionValue)) {
            this.error = `${this.label} is invalid`;
        }
        this.error = "";
        this.value = optionValue;
    }
    get isValid() {
        return !this.error;
    }
}
class SelectOption {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
}
async function fetchFormMetadata() {
    try {
        let res = await fetch("./form.json");
        if (res.ok) {
            return await res.json();
        }
        throw new Error("");
    }
    catch (error) {
        throw new Error("unable to form metadata");
    }
}
async function main() {
    let formMeta = await fetchFormMetadata();
    formMeta.forEach(function (elem) {
        let step = new Step(elem.title);
        elem.questions.forEach(function (question) {
            let dropdown = new Dropdown(question.label, question.label);
            question.options.forEach(function (choice) {
                let option = new SelectOption(choice.label, choice.value);
                dropdown.addOption(option);
            });
            step.addQuestion(dropdown);
        });
        renderStep(document.getElementById("main"), step);
    });
}
function renderOption(where, option) {
    let optionElement = document.createElement("option");
    optionElement.setAttribute("value", option.value);
    let labelText = document.createTextNode(option.label);
    optionElement.appendChild(labelText);
    where.appendChild(optionElement);
}
function renderDropdown(where, dropdown) {
    let labelElement = document.createElement("label");
    let labelText = document.createTextNode(dropdown.label);
    labelElement.setAttribute("for", formatId(dropdown.label));
    labelElement.appendChild(labelText);
    let dropdownElement = document.createElement("select");
    dropdownElement.setAttribute("value", dropdown.value);
    dropdownElement.setAttribute("id", formatId(dropdown.label));
    let container = document.createElement("div");
    container.appendChild(labelElement);
    container.appendChild(dropdownElement);
    container.classList.add("form-control");
    dropdown.options.splice(0, 0, { value: "", label: dropdown.placeholder });
    dropdown.options.forEach(function (option) {
        renderOption(dropdownElement, option);
    });
    where.appendChild(container);
}
function renderStep(where, step) {
    let stepElement = document.createElement("div");
    stepElement.setAttribute("id", formatId(step.title));
    let stepTitle = document.createElement("h3");
    let labelText = document.createTextNode(step.title);
    stepTitle.appendChild(labelText);
    stepElement.appendChild(stepTitle);
    step.dropdowns.forEach(function (dropdown) {
        renderDropdown(stepElement, dropdown);
    });
    where.appendChild(stepElement);
}
function formatId(text) {
    return text.replace(/\W/g, "-");
}
main();
//# sourceMappingURL=index.js.map