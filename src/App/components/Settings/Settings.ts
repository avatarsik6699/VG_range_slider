import { Component, RenderData, State } from "../../../Helpers/Interfaces";
import { getSettingsContent } from "../../templates/settingsTemplate";

class Settings implements Component{
  private template: string = '';
  constructor(anchor: HTMLElement, params: State) {
    this.create(anchor, params);
  }

  create(anchor: HTMLElement, params: State): void { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
    this._setVisualFields(anchor, params);
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(anchor: HTMLElement): HTMLFormElement {
    const node: HTMLFormElement | null = anchor.querySelector('.settings');
    if (!node) throw new Error(`Settings wasn't found. Also, for this to work, you must call the 'render' method`);
    return node;
  }

  render(anchor: HTMLElement, renderData: RenderData) {
    if (renderData.type === 'single') {
      this._disableField('to', anchor);
      this._setDataInFields(anchor, this._getHandlesValue(anchor))
    } else {
      this._setDataInFields(anchor, this._getHandlesValue(anchor))
    }
  }

  private _disableField(fieldName: string, anchor: HTMLElement) {
    const filed: HTMLInputElement | null = anchor.querySelector(`.settings__value[name="${fieldName}"]`)
    if (!filed) throw new Error('field wasn\'t found')
    filed.disabled = true;
  }

  private _getHandlesValue(anchor: HTMLElement): number[] {
    return Array.from(anchor.querySelectorAll('.slider__handle'))
    .map( handle => Number((handle as HTMLInputElement).dataset.value)).sort( (a,b) => a-b)
  }

  private _setDataInFields(anchor: HTMLElement, handlesValue: number[]) {
    const fields = ['from', 'to'];
    handlesValue.forEach( (number, index) => {
      let input: HTMLInputElement | null = anchor.querySelector(`.settings__value[name="${fields[index]}"]`)
      if (!input) throw new Error('input not found')
      input.value = String(number)
    })
  }
  
  setTemplate (params: State): void {
    const content = getSettingsContent(params);
    this.template = `<form class="settings" name="settings" data-component="settings">${content}</form>`;
  }

  getRootElement(anchor: HTMLElement): HTMLElement {
    const root = anchor;
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }

  private _setVisualFields(anchor: HTMLElement, params: State) {
    const visualFields = this.getRootElement(anchor).querySelectorAll('.settings select');
    
    Array.from(visualFields).forEach( field => {
      let fieldName = (field as HTMLSelectElement).name;
      let options = (field as HTMLSelectElement).options
      Array.from(options).forEach( option => {
        if (params[fieldName] === option.text) {
          option.selected = true;
        }
      }); 
    })
  } 
}

export { Settings };