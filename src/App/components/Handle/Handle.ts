import { Component, State } from "../../../Helpers/Interfaces";

abstract class Handle implements Component {
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

  getNode(anchor: HTMLElement | Element): HTMLElement {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node: HTMLElement | null = anchor.querySelector(`.slider__handle[data-id="${this.id}"`);
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  abstract render(anchor: Element | HTMLElement, renderParams: any, id: number): void;

  protected setTemplate(params: State): void {
    const modifer = `slider__handle slider__handle_position-${params.position}`;
    const value = params.value[this.id] ?? 0;
    this.template = `
    <div class="slider__handle ${modifer}" data-component="handle" data-id=${this.id} data-value=${value}></div>
    `;
  }

  getRootElement(anchor: Element | HTMLElement): Element {
    const root = anchor.querySelector('.slider');
    if (!root) throw new Error ('Hanlde was not found');
    return root;
  }
}

class hHandle extends Handle implements Component {
  render(anchor: Element | HTMLElement, renderData: any): void {
    const handle = this.getNode(anchor);
    handle.dataset.value = renderData[this.id]?.value ?? handle.dataset.value;
    handle.style.left = renderData[this.id].pxValue + 'px';
  }

}

class vHandle extends Handle implements Component {
  render(anchor: Element | HTMLElement, renderData: any): void {
    const handle = this.getNode(anchor);
    handle.dataset.value = renderData[this.id]?.value ?? handle.dataset.value;
    handle.style.top = renderData[this.id].pxValue + 'px';
  }
}

export { hHandle, vHandle }