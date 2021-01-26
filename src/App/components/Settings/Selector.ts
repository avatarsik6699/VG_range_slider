export default class Selector {
  private selectorContainer = document.createElement('div');
  private customLabel = document.createElement('span');
  private customOptions = document.createElement('ul');

  private options: CustomOption[];
  constructor(private element: HTMLSelectElement) {
    this.options = this.getFormattedOptions(element);
    this.setup();
    element.after(this.selectorContainer);
  }

  get selectedOption(): CustomOption | undefined {
    return this.options.find((option) => option.selected);
  }

  private setup() {
    this.selectorContainer.classList.add('custom-select-container');
    // делаем возможность фокусировки через tab на div
    this.selectorContainer.tabIndex = 0;
    this.customLabel.classList.add('custom-select-value');
    this.customOptions.classList.add('custon-select-options');

    this.options.forEach((item) => {
      const optionElement = document.createElement('li');
      optionElement.classList.add('custom-select-option');
      optionElement.classList.toggle('selected', item.selected);
      optionElement.innerText = item.label;
      optionElement.dataset.value = item.value;
      this.customOptions.append(optionElement);
    });

    this.customLabel.innerText = this.selectedOption ? this.selectedOption.value : 'defaultText';
    this.selectorContainer.append(this.customLabel);
    this.selectorContainer.append(this.customOptions);
  }

  private getFormattedOptions(select: HTMLSelectElement): CustomOption[] {
    // переводим нативные option -> {option's data}[]
    const options = (select.querySelectorAll('option') as unknown) as HTMLOptionsCollection;
    return Array.from(options).map((option) => ({
      value: option.value,
      label: option.label,
      selected: option.selected,
      element: option, // сам элемент для ссылки на него
    }));
  }
}

type CustomOption = { value: string; label: string; selected: boolean; element: HTMLOptionElement };
