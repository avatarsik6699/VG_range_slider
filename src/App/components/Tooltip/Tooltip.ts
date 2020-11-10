import { Component, State } from "../../../Helpers/Interfaces";
import { Handle } from "../Handle/Handle";

class Tooltip implements Component {
  template: string = `<div class="slider__tooltip"></div>`;
  constructor(params: State) {
    this.setTemplate(params.type);
  }

  create(anchor: Element | HTMLElement, renderParams?: any): this {
    let root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
    return this;
  }

  setTemplate(type: string): void {
    const className = `slider__tooltip slider__tooltip_${type}`;
    this.template = `<div class=${className} data-component="tooltip"></div>`;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name;
  }

  getNode(anchor: HTMLElement | Element): Element {
    if (!anchor) throw new Error(`didn't get anchor`);
    const node = anchor.querySelector('.slider__tooltip');
    if (!node) throw new Error(`tooltip wasn't found. Also, for this to work, you must call the 'render' method`);
    return node;
  }

  update(anchor: Element | HTMLElement, renderParams: {tipValue}): void {
    if (this.getNode(anchor)) {
      (<HTMLElement>this.getNode(anchor)).textContent = renderParams.tipValue;
    }
  }

  private getRootElement(anchor: Element): Element {
    const root = anchor.querySelector('.slider__handle');
    if (!root) throw new Error (`Root 'Handle' was not found`);
    return root;
  }
}

export { Tooltip }