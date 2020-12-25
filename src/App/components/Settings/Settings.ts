import { RECRATE_APP } from '../../../Helpers/Constants';
import { Component, State } from '../../../Helpers/Interfaces';
import Observer from '../../../Helpers/Observer';
import { getSettingsContent } from '../../templates/settings.template';

class Settings extends Observer implements Component {
  private template = '';

  private eventIsAdded = false;

  constructor(private anchor: HTMLElement, state: State) {
    super();
    this.create(state);
    this.bindEvent();
  }

  create(state: State): void {
    this.setTemplate(state);
    this.getRootElement().insertAdjacentHTML('beforeend', this.template);
    this.setVisualFields(state);
  }

  getRootElement(): HTMLElement {
    const root = this.anchor;
    if (!root) throw new Error(`root 'Slider' wasn't found`);
    return root;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(): HTMLFormElement {
    const node = this.anchor.querySelector('.settings') as HTMLFormElement;
    if (!node) throw new Error(`Settings wasn't found`);
    return node;
  }

  render(): void {
    this.setDataInFields(this.getHandlesValue());
  }

  private getHandlesValue(): number[] {
    return Array.from(this.anchor.querySelectorAll('.slider__handle'))
      .map((handle) => Number((handle as HTMLElement).dataset.value))
      .sort((a, b) => a - b);
  }

  private setDataInFields(handlesValues: number[]) {
    const fields: HTMLInputElement[] = Array.from(
      this.getNode().querySelectorAll('.settings__item input[name^="value-"]'),
    );
    handlesValues.forEach((number, index) => {
      fields[index].value = String(number);
    });
  }

  private setVisualFields(state: State) {
    const visualFields = this.getNode().querySelectorAll('.settings__item select');
    Array.from(visualFields).forEach((field) => {
      const { name } = field as HTMLSelectElement;
      const { options } = field as HTMLSelectElement;
      Array.from(options).forEach((option) => {
        if (state[name] === option.text) {
          // eslint-disable-next-line no-param-reassign
          option.selected = true;
        }
      });
    });
  }

  private setTemplate(state: State): void {
    const content = getSettingsContent(state);
    this.template = `<form class="settings" name="settings" data-component="settings">${content}</form>`;
  }

  private bindEvent() {
    const getSettingsData = (ev) => {
      const values: number[] = [];
      const result = Array.from(this.getNode().elements).reduce((settingsData, item) => {
        const { value, name } = <HTMLInputElement | HTMLSelectElement>item;
        if (name.indexOf('value') !== -1) {
          values.push(+value);
          return { ...settingsData };
        }
        return {
          ...settingsData,
          [name]: Number.isNaN(Number(value)) ? value : Number(value),
        };
      }, {});
      ev.target.removeEventListener('blur', getSettingsData);
      ev.target.removeEventListener('change', getSettingsData);
      this.eventIsAdded = false;
      this.notify('settingsEvent', { ...result, value: values, action: RECRATE_APP });
    };

    const handlersAdding = (ev) => {
      if (this.isTargetFieldAndEventAdded(ev.target.nodeName, ['INPUT', 'SELECT'])) {
        this.eventIsAdded = true;

        ev.target.addEventListener('blur', getSettingsData, { once: true });
        ev.target.addEventListener('change', getSettingsData, { once: true });
      }
    };
    this.getNode().addEventListener('mousedown', handlersAdding);
  }

  private isTargetFieldAndEventAdded(target: string, fields: Array<string>) {
    return fields.filter((item) => target === item).length >= 1 && !this.eventIsAdded;
  }
}

export default Settings;
