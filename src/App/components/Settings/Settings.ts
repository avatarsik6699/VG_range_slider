import { State } from "../../../Helpers/Interfaces";
import { getSettingsContent } from "../../templates/settingsTemplate";

class Settings {
  private template: string = '';
  constructor(anchor: Element | HTMLElement, params: State) {
    this.create(anchor, params);
  }

  create(anchor: Element | HTMLElement, params: State): this { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
    this._renderVisualFields(anchor, params);
    return this;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(anchor: HTMLElement | Element): Element {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector('.settings');
    if (!node) throw new Error(`Settings wasn't found. Also, for this to work, you must call the 'render' method`);
    return node;
  }

  render(anchor: Element | HTMLElement, renderData?: any): void {
    ['from', 'to'].forEach( field => {
      const input: HTMLInputElement | null = anchor.querySelector(`.settings__value[name="${field}"]`);
      if (!input) throw new Error('input not found');
      this._setValuesField(anchor, field, input)
    })
  }

  private _setValuesField(anchor: Element | HTMLElement, field: string, input: HTMLInputElement): void {
    const handles: HTMLElement[] = Array.from(anchor.querySelectorAll('.slider__handle'));
    const values = handles.map( handle => Number(handle.dataset.value));
    if (values.length < 2) {
      values.push(0);
      (<HTMLInputElement>anchor.querySelector('.settings__value[name="to"]')).disabled = true;
    }
    
    if (field === 'from') {
      input.value = values[0] < values[1]
      ? String(values[0])
      : String(values[1])
    } else {
      input.value = values[0] > values[1]
      ? String(values[0])
      : String(values[1])
    }
  }
  
  setTemplate (options: State | {} = {}): void {
    let content = getSettingsContent(options);
    this.template = `<form class="settings" name="settings" data-component="settings">${content}</form>`;
  }

  getRootElement(anchor: Element): Element {
    const root = anchor;
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }

  private _renderVisualFields(anchor: Element | HTMLElement, params: State) {
    const visualFields = this.getRootElement(anchor).querySelectorAll('.settings select');
    
    Array.from(visualFields).forEach( field => {
      let fieldName = (<HTMLSelectElement>field).name;
      let options = (<HTMLSelectElement>field).options
      Array.from(options).forEach( option => {
        if (params[fieldName] === option.text) {
          option.selected = true;
        }
      });
    })
  } 
}

export { Settings };