import { Component, RenderData, State } from "../../../Helpers/Interfaces";
import { getSettingsContent } from "../../templates/settings.template";

class Settings implements Component {
  private template: string = '';
  constructor(anchor: HTMLElement, state: State) {
    this.create(anchor, state);
  }

  create(anchor: HTMLElement, state: State): void { 
    this._setTemplate(state);
    this.getRootElement(anchor).insertAdjacentHTML('beforeend', this.template);
    this._setVisualFields(anchor, state);
  }

  getRootElement(anchor: HTMLElement): HTMLElement {
    const root = anchor;
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(anchor: HTMLElement): HTMLFormElement {
    const node: HTMLFormElement | null = anchor.querySelector('.settings');
    if (!node) throw new Error(`Settings wasn't found`);
    return node;
  }

  render(anchor: HTMLElement, renderData: RenderData) {
    if (renderData.type === undefined) throw new Error('type wasn\'t found');
    if (renderData.type === 'single') {
      this._disableField('to', anchor);
      this._setDataInFields(anchor, this._getHandlesValue(anchor))
    } else {
      this._setDataInFields(anchor, this._getHandlesValue(anchor))
    }
  }

  private _disableField(fieldName: string, anchor: HTMLElement) {
    const filed = anchor.querySelector(`.settings__value[name="${fieldName}"]`) as HTMLInputElement
    if (!filed) throw new Error('field wasn\'t found')
    filed.disabled = true;
  }

  private _getHandlesValue(anchor: HTMLElement): number[] {
    return Array.from(anchor.querySelectorAll('.slider__handle'))
    .map( handle => Number((handle as HTMLElement).dataset.value)).sort( (a,b) => a-b)
  }

  private _setDataInFields(anchor: HTMLElement, handlesValue: number[]) {
    const fields = ['from', 'to'];
    handlesValue.forEach( (number, index) => {
      let input = anchor.querySelector(`.settings__value[name="${fields[index]}"]`) as HTMLInputElement
      if (!input) throw new Error('input wasn\'t found')
      input.value = String(number);
    })
  }

  private _setVisualFields(anchor: HTMLElement, state: State) {
    const visualFields = this.getRootElement(anchor).querySelectorAll('.settings select');
    
    Array.from(visualFields).forEach( field => {
      let fieldName = (field as HTMLSelectElement).name;
      let options = (field as HTMLSelectElement).options
      Array.from(options).forEach( option => {
        if (state[fieldName] === option.text) {
          option.selected = true;
        }
      }); 
    })
  }
  
  private _setTemplate (state: State): void {
    const content = getSettingsContent(state);
    this.template = `<form class="settings" name="settings" data-component="settings">${content}</form>`;
  }
}

export { Settings };