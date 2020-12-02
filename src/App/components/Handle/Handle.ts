import { Component, RenderData, State } from "../../../Helpers/Interfaces";

interface HandleInterface {
  render(anchor: HTMLElement, renderData: RenderData): void;
}

abstract class Handle implements Component {
  protected template: string = '';
  constructor(anchor: HTMLElement, params: {position: string, value: number[]}, protected id: number) {
    this.create(anchor, params);
  }

  create(anchor: HTMLElement, params: {position: string, value: number[]}): void { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
  }

  getNode(anchor: HTMLElement): HTMLElement {
    const node: HTMLElement = anchor.querySelector(`.slider__handle[data-id="${this.id}"]`) as HTMLElement;
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  abstract render(anchor: HTMLElement, renderData: RenderData, id: number): void;

  protected setTemplate(params: {position: string, value: number[]}): void {
    if (params.position === undefined && params.value === undefined) {
      throw new Error('incorrect params: wasn\'t found position or value');
    }
    const modifer = `slider__handle slider__handle_position-${params.position}`;
    const value = params.value[this.id] ?? 0;
    this.template = `
    <div class="slider__handle ${modifer}" data-component="handle" data-id=${this.id} data-value=${value}></div>
    `;
  }

  getRootElement(anchor: HTMLElement): HTMLElement {
    const root = anchor.querySelector('.slider') as HTMLElement;
    if (!root) throw new Error ('Root wasn\'t found');
    return root;
  }
}

class hHandle extends Handle implements HandleInterface {
  render(anchor: HTMLElement, renderData: RenderData): void {
    const handle = this.getNode(anchor);
    handle.dataset.value = String(renderData[this.id].value) ?? handle.dataset.value;
    handle.style.left = renderData[this.id].pxValue + 'px';
  }

}

class vHandle extends Handle implements HandleInterface {
  render(anchor: HTMLElement, renderData: RenderData): void {
    const handle = this.getNode(anchor);
    handle.dataset.value = String(renderData[this.id]?.value) ?? handle.dataset.value;
    handle.style.top = renderData[this.id].pxValue + 'px';
  }
}

export { hHandle, vHandle }