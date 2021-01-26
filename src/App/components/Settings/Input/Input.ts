import { spawn } from 'child_process';
import './Input.scss';

export default class Input {
  input: HTMLInputElement;
  buttons: { [key: string]: HTMLButtonElement };
  inputContainer: HTMLElement;
  inputWrapper: HTMLElement;
  label: HTMLLabelElement;

  constructor(
    private root: HTMLElement,
    private structure,
    private index,
  ) {
    // контейнер оборачивающий все элементы и вставляющийся в якорь(root)
    this.inputContainer = this.createInputContainer();

    // текст над инпутом
    this.label = this.createLabel(this.inputContainer);

    // инпут + кнопки
    this.inputWrapper = this.createInputWrapper(this.inputContainer);
    this.input = this.createInput(this.inputWrapper);
    this.buttons = this.createButtons(this.inputWrapper);
    this.bindEvents();
  }

  createInputContainer() {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('custom-input');
    this.root?.append(inputContainer);
    return inputContainer;
  }

  createLabel(root) {
    const label = document.createElement('label');
    label.classList.add('custom-input__label');
    label.htmlFor = `custom-input-${this.index}`;
    label.textContent = 'max';
    root.append(label);

    return label;
  }

  createInputWrapper(root) {
    // оборачивает инпут и кнопки для стилизации
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('custom-input__wrapper');
    root.append(inputWrapper);
    return inputWrapper;
  }

  createInput(root): HTMLInputElement {
    const input = document.createElement('input');
    input.classList.add('custom-input__field');
    input.id = `custom-input-${this.index}`;
    input.type = 'number';
    input.step = '5';
    input.name = 'max';
    input.value = '55';
    input.pattern = '[0-9]+';
    input.placeholder = 'value'; //name

    // add input,wrapper to page

    root.append(input);
    return input;
  }

  createButtons(root): { [key: string]: HTMLButtonElement } {
    const orientation = 'HORIZONTAL';

    // create subButton
    const subButton = document.createElement('button');
    subButton.classList.add('custom-input__sub');
    subButton.textContent = '-';
    subButton.dataset.operation = '-';

    // create addButton
    const addButton = document.createElement('button');
    addButton.classList.add('custom-input__add');
    addButton.textContent = '+';
    addButton.dataset.operation = '+';

    switch (orientation) {
      case 'HORIZONTAL': {
        root.prepend(subButton);
        root.append(addButton);
        break;
      }
      case 'VERTICAL': {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add(
          'custom-input__buttons-container',
        );
        root.append(buttonsContainer);
        buttonsContainer.append(subButton);
        buttonsContainer.append(addButton);
        break;
      }
    }

    return { subButton, addButton };
  }

  bindEvents() {
    const { addButton, subButton } = this.buttons;

    const inputHandler = (ev: Event) => {
      console.log((ev.target as HTMLInputElement).value);
    };

    const buttonHandler = (ev: Event) => {
      const step = 5;
      const inputValue = Number(this.input.value);
      const newInputValue =
        (ev.target as HTMLButtonElement).dataset.operation === '+'
          ? inputValue + step
          : inputValue - step;
      this.input.value = String(newInputValue);
    };

    this.input.addEventListener('input', inputHandler);
    this.input.addEventListener('blur', inputHandler);
    addButton.addEventListener('click', buttonHandler);
    subButton.addEventListener('click', buttonHandler);
  }
}

type InputStructure = {
  type: string;
  value: string;
  name: string;
  step: number;
  pattern?: string;
  orientation: 'HORIZONTAL' | 'VERTICAL';
};
