import { Component, State } from "../../../Helpers/Interfaces";

class Bar implements Component {
  template: string = `<div class="slider__bar"></div>`;
  constructor(params: State) {
    this.setTemplate(params.type);
  }

  render(anchor: Element | HTMLElement, renderParams?: any): void {
    let el = this.getRootElement(anchor);
    el.insertAdjacentHTML('beforeend', this.template);
  }

  setTemplate(type: string): void {
    const className = `slider__bar slider__bar_${type}`;
    this.template = `<div class=${className} data-component="bar"></div>`;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name;
  }

  getNode(anchor: HTMLElement | Element): Element {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector('.slider__bar');
    if (!node) throw new Error(`bar wasn't found. Also, for this to work, you must call the 'render' method`);
    return node;
  }

  private getRootElement(anchor: Element): Element {
    const el = anchor.querySelector('.slider');
    if (!el) throw new Error (`Slider wasn't found`);
    return el;
  }
}

export { Bar };