import { Component, State } from "../../../Helpers/Interfaces";

class Bar implements Component {
  template: string = '';
  static componentName: string = Object.getPrototypeOf(Bar).constructor.name.toLowerCase();
  constructor(params: State) {
    this.setTemplate(params.position);
  }

  create(anchor: Element | HTMLElement): this { 
    let el = this.getRootElement(anchor);
    el.insertAdjacentHTML('beforeend', this.template);
    return this;
  }

  setTemplate(position: string): void {
    const className = `slider__bar slider__bar_${position}`;
    this.template = `<div class="${className}" data-component="bar"></div>`;
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

  update(anchor: Element | HTMLElement, renderParams: {pxValue: number} | any): void {
    if (this.getNode(anchor)) {
      let bar = (<HTMLElement>this.getNode(anchor));
      // if (renderParams.type === 'range') {
      //   let correctWidth = renderParams[1].correctPxValue - renderParams[0].correctPxValue;
      //   bar.style.width = correctWidth + 20 + 'px';
      //   bar.style.left = renderParams[0].correctPxValue + 'px'
      // }
    }
  }

  private getRootElement(anchor: Element): Element {
    const el = anchor.querySelector('.slider');
    if (!el) throw new Error (`Slider wasn't found`);
    return el;
  }
}

export { Bar };