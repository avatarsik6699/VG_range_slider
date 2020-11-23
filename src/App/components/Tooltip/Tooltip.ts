import { Component, State } from "../../../Helpers/Interfaces";
abstract class Tooltip {
  protected template: string = '';
  constructor(anchor: Element | HTMLElement, params: State, protected id?: number) {
    this.create(anchor, params);
  }

  create(anchor: Element | HTMLElement, params: State): this| undefined { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
    return this;
  }

  getNode(anchor: HTMLElement | Element, id: number): Element {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector(`.slider__tooltip[data-id="${id}"`);
    if (!node) throw new Error(`tooltip wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  abstract render(anchor: Element | HTMLElement, renderParams: any, id: number): void;

  protected setTemplate(params: State): void {
    const modifer = `slider__tooltip slider__tooltip_position-${params.position}`;
    this.template = `<div class="slider__tooltip ${modifer}" data-component="tooltip" data-id=${this.id}>0</div>`;
  }

  protected getRootElement(anchor: Element): Element {
    const root = anchor.querySelector(`.slider__handle[data-id="${this.id}"]`);
    if (!root) throw new Error ('Hanlde was not found');
    return root;
  }
}

class hTooltip extends Tooltip {
  render(anchor: Element | HTMLElement, renderParams: any, id: number): void {
    if (renderParams[id] === undefined) return;
    const toolTip = (<HTMLElement>this.getNode(anchor, id));
    const offset = (String(renderParams[id].value).split('').length - 1) * 4;
  
    toolTip.innerHTML = renderParams[id].value;
    toolTip.style.left = -offset + 'px';
  }
}

class vTooltip extends Tooltip {
  render(anchor: Element | HTMLElement, renderParams: any, id: number): void {
    if (renderParams[id] === undefined) return;
    const toolTip = (<HTMLElement>this.getNode(anchor, id));
    toolTip.innerHTML = renderParams[id].value;
  }
}

export { hTooltip, vTooltip };