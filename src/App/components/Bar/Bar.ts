import { Component, State } from "../../../Helpers/Interfaces";

class Bar implements Component {
  template: string = `<div class="slider__bar"></div>`;
  constructor(params: State) {
    this.setTemplate(params.type);
  }

  render(anchor: Element | HTMLElement): void { 
    let el = this.getRootElement(anchor);
    el.insertAdjacentHTML('beforeend', this.template);
    
  }

  setTemplate(type: string, template?: string): void {
    const className = `slider__bar slider__bar_${type}`;
    this.template = !template ? `<div class=${className} data-component="bar"></div>` : template;
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

  update(anchor: Element | HTMLElement, renderParams: {pxValue: number}): void {
    if (this.getNode(anchor)) {
      (<HTMLElement>this.getNode(anchor)).style.width = renderParams.pxValue + 10 + 'px';
    }
  }

  private getRootElement(anchor: Element): Element {
    const el = anchor.querySelector('.slider');
    if (!el) throw new Error (`Slider wasn't found`);
    return el;
  }
}

export { Bar };