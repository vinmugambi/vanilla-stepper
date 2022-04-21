type OptionStruct = {
  value: string;
  label: string;
};

class Stepper {
  constructor(where: Node) {}

  render(where: Node) {}
}

class DisplayStep {
  element: HTMLElement;
  constructor(where: Node, step: Step) {
    this.element = document.createElement("div");
    this.element.setAttribute("id", formatId(step.title));
    let stepTitle = document.createElement("h3");
    let labelText = document.createTextNode(step.title);
    stepTitle.appendChild(labelText);
    this.element.appendChild(stepTitle);

    // step.dropdowns.forEach(
    //   function (dropdown) {
    //     this.renderQuestion(dropdown);
    //   }.bind(this)
    // );

    where.appendChild(this.element);
  }
}

class DisplayDropdown {
  element: HTMLSelectElement;
  dropdown: Dropdown;
  error: HTMLSpanElement;
  constructor(where: Node, dropdown: Dropdown) {
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

  private listenChange() {
    this.element.addEventListener(
      "change",
      function (event) {
        this.dropdown.select(event.target.value);
      }.bind(this)
    );
  }

  displayError(string) {
    this.error.textContent = string;
  }

  clearError() {
    this.error.textContent = "";
  }
}

class DisplayOption {
  element: HTMLElement;

  constructor(where: Node, label: string, value: string) {
    let optionElement = document.createElement("option");
    optionElement.setAttribute("value", value);

    let labelText = document.createTextNode(label);
    optionElement.appendChild(labelText);

    where.appendChild(optionElement);
  }
}
class Step {
  title: string;
  dropdowns: Dropdown[] = [];
  displayed: DisplayStep;

  constructor(parent: HTMLElement, title: string) {
    this.title = title;
    this.render(parent);
  }

  addQuestion(label: string, options: { label: string; value: string }[]) {
    let dropdown = new Dropdown(this.displayed.element, label, options);
    this.dropdowns.push(dropdown);
  }

  get isValid(): boolean {
    return this.dropdowns.reduce(function isValid(pre, cur: any) {
      return cur.isValid ? pre : cur.isValid;
    }, true);
  }

  private render(where: HTMLElement) {
    this.displayed = new DisplayStep(where, this);
  }
}

class Dropdown {
  value: string = "";
  label: string;
  placeholder: string;
  options: SelectOption[] = [];
  validOptions: string[] = [];
  error: string;
  displayed: DisplayDropdown;

  constructor(
    where: HTMLElement,
    label: string,
    options: { label: string; value: string }[]
  ) {
    this.label = label;
    this.placeholder = label;
    this.render(where);
    this.addOption(this.label, "");
    options.forEach((elem) => {
      this.addOption(elem.label, elem.value);
    });
  }

  addOption(label: string, value: string) {
    let option = new SelectOption(this.displayed.element, label, value);
    this.options.push(option);
  }

  select(optionValue: string) {
    if (!this.validOptions.includes(optionValue)) {
      this.error = `${this.label} is invalid`;
      this.displayed.displayError(this.error);
    } else {
      this.error = "";
      this.displayed.clearError();
      this.value = optionValue;
    }
  }

  get isValid(): boolean {
    return !this.error;
  }

  render(where: HTMLElement) {
    this.displayed = new DisplayDropdown(where, this);
  }
}

class SelectOption {
  label: string;
  value: string;

  constructor(where: HTMLSelectElement, label: string, value: string) {
    this.label = label;
    this.value = value;

    this.render(where);
  }

  render(where: HTMLElement) {
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
  } catch (error) {
    throw new Error("unable to form metadata");
  }
}

async function main() {
  let formMeta = await fetchFormMetadata();
  let root = document.getElementById("main");

  formMeta.forEach(function (elem: {
    title: string;
    questions: { label: string; options: OptionStruct[] }[];
  }) {
    let step = new Step(root, elem.title);
    elem.questions.forEach(function (question) {
      step.addQuestion(question.label, question.options);
    });
  });
}

function formatId(text: string) {
  return text.replace(/\W/g, "-").toLocaleLowerCase();
}

main();
