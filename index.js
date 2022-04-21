class Stepper {
    constructor(where) { }
    render(where) { }
}
class DisplayStep {
    constructor(where, step) {
        this.element = document.createElement("div");
        this.element.setAttribute("id", formatId(step.title));
        let stepTitle = document.createElement("h3");
        let labelText = document.createTextNode(step.title);
        stepTitle.appendChild(labelText);
        this.element.appendChild(stepTitle);
        where.appendChild(this.element);
    }
}
class DisplayDropdown {
    constructor(where, dropdown) {
        let labelElement = document.createElement("label");
        let labelText = document.createTextNode(dropdown.label);
        labelElement.setAttribute("for", formatId(dropdown.label));
        labelElement.appendChild(labelText);
        this.element = document.createElement("select");
        this.dropdown = dropdown;
        this.element.setAttribute("value", dropdown.value);
        this.element.setAttribute("id", formatId(dropdown.label));
        this.error = document.createElement("span");
        this.error.textContent = dropdown.error;
        let container = document.createElement("div");
        container.appendChild(labelElement);
        container.appendChild(this.element);
        container.appendChild(this.error);
        container.classList.add("form-control");
        where.appendChild(container);
        this.listenChange();
    }
    listenChange() {
        this.element.addEventListener("change", function (event) {
            this.dropdown.select(event.target.value);
        }.bind(this));
    }
    displayError(string) {
        this.error.textContent = string;
    }
    clearError() {
        this.error.textContent = "";
    }
}
class DisplayOption {
    constructor(where, label, value) {
        let optionElement = document.createElement("option");
        optionElement.setAttribute("value", value);
        let labelText = document.createTextNode(label);
        optionElement.appendChild(labelText);
        where.appendChild(optionElement);
    }
}
class Step {
    constructor(parent, title) {
        this.dropdowns = [];
        this.title = title;
        this.render(parent);
    }
    addQuestion(label, options) {
        let dropdown = new Dropdown(this.displayed.element, label, options);
        this.dropdowns.push(dropdown);
    }
    get isValid() {
        return this.dropdowns.reduce(function isValid(pre, cur) {
            return cur.isValid ? pre : cur.isValid;
        }, true);
    }
    render(where) {
        this.displayed = new DisplayStep(where, this);
    }
}
class Dropdown {
    constructor(where, label, options) {
        this.value = "";
        this.options = [];
        this.validOptions = [];
        this.label = label;
        this.placeholder = label;
        this.render(where);
        this.addOption(this.label, "");
        options.forEach((elem) => {
            this.addOption(elem.label, elem.value);
        });
    }
    addOption(label, value) {
        let option = new SelectOption(this.displayed.element, label, value);
        this.options.push(option);
    }
    select(optionValue) {
        if (!this.validOptions.includes(optionValue)) {
            this.error = `${this.label} is invalid`;
            this.displayed.displayError(this.error);
        }
        else {
            this.error = "";
            this.displayed.clearError();
            this.value = optionValue;
        }
    }
    get isValid() {
        return !this.error;
    }
    render(where) {
        this.displayed = new DisplayDropdown(where, this);
    }
}
class SelectOption {
    constructor(where, label, value) {
        this.label = label;
        this.value = value;
        this.render(where);
    }
    render(where) {
        new DisplayOption(where, this.label, this.value);
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
    let root = document.getElementById("main");
    formMeta.forEach(function (elem) {
        let step = new Step(root, elem.title);
        elem.questions.forEach(function (question) {
            step.addQuestion(question.label, question.options);
        });
    });
}
function formatId(text) {
    return text.replace(/\W/g, "-").toLocaleLowerCase();
}
main();
//# sourceMappingURL=index.js.map