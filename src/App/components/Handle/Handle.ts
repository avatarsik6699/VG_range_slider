import { param } from "jquery";
import { Component, State } from "../../../Helpers/Interfaces";

abstract class Handle {
  protected template: string = '';
  constructor(anchor: Element | HTMLElement, params: State, protected id: number) {
    this.create(anchor, params);
  }

  create(anchor: Element | HTMLElement, params: State): this { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
    return this;
  }

  getNode(anchor: HTMLElement | Element, id: number): Element | HTMLElement {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector(`.slider__handle[data-id="${id}"`);
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.slice(1);
  }

  abstract update(anchor: Element | HTMLElement, renderParams: any, id: number): void;

  protected setTemplate(params: State): void {
    const modifer = `slider__handle slider__handle_position-${params.position}`;
    this.template = `<div class="slider__handle ${modifer}" data-component="handle" data-id=${this.id}></div>`;
  }

  getRootElement(anchor: Element | HTMLElement): Element {
    const root = anchor.querySelector('.slider');
    if (!root) throw new Error ('Hanlde was not found');
    return root;
  }
}

class hHandle extends Handle {
  update(anchor: Element | HTMLElement, renderData: any): void {
    const handle = (<HTMLElement>this.getNode(anchor, this.id!));
    console.log(renderData)
    if (!renderData[this.id]) return;
    handle.style.left = renderData[this.id].pxValue + 'px';
  }

}

class vHandle extends Handle {
  update(anchor: Element | HTMLElement, renderData: any): void {
    const handle = (<HTMLElement>this.getNode(anchor, this.id!));
    
    if (!renderData[this.id]) return;
    handle.style.top = renderData[this.id].pxValue + 'px';
  }
}

export { hHandle, vHandle }