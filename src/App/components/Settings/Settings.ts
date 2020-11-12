import { State } from "../../../Helpers/Interfaces";
import { settingsContent } from "../../templates/settingsTemplate";

class Settings {
  private template: string = '';
  constructor(anchor: Element | HTMLElement, params: State) {
    this.create(anchor, params);
  }

  create(anchor: Element | HTMLElement, params: State): this { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
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

  update(anchor: Element | HTMLElement, renderParams: {pxValue: number} | any): void {

  }
  
  setTemplate (params: State): void {
    let content = settingsContent;
    this.template = `<form class="settings" data-component="settings">${content}</form>`;
  }

  getRootElement(anchor: Element): Element {
    const root = anchor;
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }
}

export { Settings };