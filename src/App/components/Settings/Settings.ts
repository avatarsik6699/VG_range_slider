import { Component, State } from "../../../Helpers/Interfaces";
import { getSettingsContent } from "../../templates/settingsTemplate";

class Settings implements Component {
  private template: string = '';
  constructor(anchor: Element | HTMLElement, params: State) {
    this.create(anchor, params);
  }

  create(anchor: Element | HTMLElement, params: State): this { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
    this._setVisualFields(anchor, params);
    return this;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(anchor: HTMLElement): HTMLFormElement {
    if (!anchor) throw new Error(`didn't get anchor`);
    const node: HTMLFormElement | null = anchor.querySelector('.settings');
    if (!node) throw new Error(`Settings wasn't found. Also, for this to work, you must call the 'render' method`);
    return node;
  }

  render(anchor: HTMLElement, renderData?: any): void {
    if (renderData.type === 'single') {
      this._disableField('to', anchor);
      this._setDataInFields(anchor, this._getHandlesValue(anchor))
    } else {
      this._setDataInFields(anchor, this._getHandlesValue(anchor))
    }
  }

  private _disableField(field: string, anchor: HTMLElement) {
    (<HTMLInputElement>anchor.querySelector(`.settings__value[name="${field}"]`)).disabled = true;
  }

  private _getHandlesValue(anchor: Element | HTMLElement): number[] {
    return Array.from(anchor.querySelectorAll('.slider__handle'))
    .map( handle => Number((<HTMLInputElement>handle).dataset.value)).sort( (a,b) => a-b)
  }

  private _setDataInFields(anchor: HTMLElement, handlesValue: number[]) {
    const fields = ['from', 'to'];
    handlesValue.forEach( (number, index) => {
      let input = (<HTMLInputElement>anchor.querySelector(`.settings__value[name="${fields[index]}"]`))
      input.value = String(number)
    })
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

  private _setVisualFields(anchor: Element | HTMLElement, params: State) {
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