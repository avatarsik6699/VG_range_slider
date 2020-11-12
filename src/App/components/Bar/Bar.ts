import { Component, State } from "../../../Helpers/Interfaces";

abstract class Bar {
  protected template: string = '';
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
    let node = anchor.querySelector('.slider__bar');
    if (!node) throw new Error(`bar wasn't found. Also, for this to work, you must call the 'render' method`);
    return node;
  }

  abstract update(anchor: Element | HTMLElement, renderParams: {pxValue: number} | any): void
  
  protected setTemplate (params: State): void {
    const modifer = `slider__bar_position-${params.position}`
    this.template = `<div class="slider__bar ${modifer}" data-component="bar"></div>`;
  }

  protected getRootElement(anchor: Element): Element {
    const root = anchor.querySelector('.slider');
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }
}

class hBar extends Bar {
  update(anchor: Element | HTMLElement, renderParams: any): void {
    const bar = (<HTMLElement>this.getNode(anchor));
    if (renderParams.type === 'single') {
      bar.style.left = 0 + 'px';
      bar.style.width = renderParams['0'].correctPxValue + 20 + 'px';
    } else {
      console.log('range')
    }
  }
}

class vBar extends Bar {
  update(anchor: Element | HTMLElement, renderParams: any): void {
    console.log(this.getName());
  }
}

export { hBar, vBar };