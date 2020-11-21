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
    this._updateVisualFields(anchor, params);
    return this;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.slice(1);
  }

  getNode(anchor: HTMLElement | Element): Element {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector('.settings');
    if (!node) throw new Error(`Settings wasn't found. Also, for this to work, you must call the 'render' method`);
    return node;
  }

  update(anchor: Element | HTMLElement, renderParams: any): void {
    const inputValue: HTMLInputElement | null = this.getRootElement(anchor).querySelector('.settings input[name="value"]');
    if (!inputValue) throw new Error('input не найден');
    
    inputValue.value = !renderParams[0] 
    ? renderParams[1].value
    : renderParams[0].value
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

  private _updateVisualFields(anchor: Element | HTMLElement, params: State) {
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