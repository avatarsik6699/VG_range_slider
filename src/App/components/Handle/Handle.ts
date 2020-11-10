import { Component, State } from "../../../Helpers/Interfaces";

class Handle implements Component {
  template: string = `<div class="slider__handle"></div>`;
  
  constructor(params: State, index?: number) {
    this.setTemplate(params.type, index);
  }

  create(anchor: Element | HTMLElement): this {
    let el = this.getRootElement(anchor);
    el.insertAdjacentHTML('beforeend', this.template);
    return this;
  }

  setTemplate(type: string, id: number = 0): void {
    const className = `slider__handle slider__handle_${type}`;
    this.template = `<div class="${className}" data-component="handle" data-id=${id}></div>`;
  }

  update(anchor: Element | HTMLElement, renderParams: any, id: number): void {
    if (renderParams[id] === undefined) return;
    console.log(renderParams)
    if (this.getNode(anchor, id)) {
      let handle = (<HTMLElement>this.getNode(anchor, id));
      if (renderParams.position === 'horizontal') {
        handle.style.left = renderParams[id].correctPxValue + 'px';
      } else {
        handle.style.top = renderParams[id].correctPxValue + 'px';
      }
    }
  }

  getNode(anchor: HTMLElement | Element, id: number): Element {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector(`.slider__handle[data-id="${id}"`);
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name;
  }

  private getRootElement(anchor: Element): Element {
    const el = anchor.querySelector('.slider');
    if (!el) throw new Error ('Hanlde was not found');
    return el;
  }
}

export { Handle }