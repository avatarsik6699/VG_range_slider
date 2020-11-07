import { Component, State } from "../../../Helpers/Interfaces";

class Tooltip implements Component {
  template: string = `<div class="slider__tooltip"></div>`;
  constructor(params: State) {
    this.setTemplate(params.type);
  }

  render(anchor: Element | HTMLElement, renderParams?: any): void {
    let root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
  }

  setTemplate(type: string): void {
    const className = `slider__tooltip slider__tooltip_${type}`;
    this.template = `<div class=${className} data-component="tooltip"></div>`;
  }

  private getRootElement(anchor: Element): Element {
    const root = anchor.querySelector('.slider__handle');
    if (!root) throw new Error ('Hanlde was not found');
    return root;
  }
}

export { Tooltip }