import { Component, State } from "../../../Helpers/Interfaces";

class Handle implements Component {
  template: string = `<div class="slider__handle"></div>`;
  constructor(params: State) {
    this.setTemplate(params.type);
  }

  render(anchor: Element | HTMLElement, renderParams?: any): void {
    let el = this.getRootElement(anchor);
    el.insertAdjacentHTML('beforeend', this.template);
  }

  setTemplate(type: string): void {
    const className = `slider__handle slider__handle_${type}`;
    this.template = `<div class=${className} data-component="handle"></div>`;
  }

  private getRootElement(anchor: Element): Element {
    const el = anchor.querySelector('.slider');
    if (!el) throw new Error ('Hanlde was not found');
    return el;
  }
}

export { Handle }