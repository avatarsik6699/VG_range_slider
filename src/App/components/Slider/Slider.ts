import { State } from "../../../Helpers/Interfaces";

abstract class Slider {
  protected template: string = `
  <div class="slider-wrapper">
    <div class="slider">
    </div>
  </div>`;
  constructor(anchor: Element | HTMLElement, params: State) {
    this.create(anchor, params);
  }

  create(anchor: Element | HTMLElement, params: State): this { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('afterbegin', this.template);
    return this;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.slice(1);
  }

  getNode(anchor: HTMLElement | Element): Element {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector('.slider');
    if (!node) throw new Error(`slider wasn't found. Also, for this to work, you must call the 'render' method`);
    return node;
  }

  abstract update(anchor: Element | HTMLElement, renderParams: any): void
  
  setTemplate (params: State): void {
    const modifer = `slider_position-${params.position}`
    this.template = `
    <div class="slider-wrapper">
      <div class="slider ${modifer}" data-component="slider">
      </div>
    </div>`;
  }

  protected getRootElement(anchor: Element): Element {
    const root = anchor;
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }
}

class vSlider extends Slider {
  update(anchor: Element | HTMLElement, renderParams:  any): void {console.log(this.getName())}
}

class hSlider extends Slider {
  update(anchor: Element | HTMLElement, renderParams: any): void {console.log(this.getName());
  }
}

export { vSlider, hSlider };