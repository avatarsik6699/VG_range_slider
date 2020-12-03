import { Component, RenderData, State } from "../../../Helpers/Interfaces";
abstract class Tooltip implements Component {
  protected template: string = '';
  constructor(anchor: HTMLElement, params: {position: 'horizontal'}, protected id: number) {
    this.create(anchor, params);
  }

  create(anchor: HTMLElement, params: {position: string}) { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
  }

  getNode(anchor: HTMLElement, id: number): HTMLElement {
    const node = anchor.querySelector(`.slider__tooltip[data-id="${id}"]`) as HTMLElement;
    if (!node) throw new Error(`tooltip wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  abstract render(anchor: HTMLElement, renderData: RenderData): void;

  protected setTemplate(params: {position: string}): void {
    if(!params.position) throw new Error('position in params wasn\'t found')
    const modifer = `slider__tooltip slider__tooltip_position-${params.position}`;
    this.template = `<div class="slider__tooltip ${modifer}" data-component="tooltip" data-id=${this.id}>0</div>`;
  }

  getRootElement(anchor: HTMLElement): HTMLElement {
    const root = anchor.querySelector(`.slider__handle[data-id="${this.id}"]`) as HTMLElement;
    if (!root) throw new Error ('Hanlde was not found');
    return root;
  }
}

class hTooltip extends Tooltip {
  render(anchor: HTMLElement, renderData: RenderData): void {
    if (renderData[this.id] === undefined) return;
    const offset = (String(renderData[this.id].value).split('').length - 1) * 4;
    const toolTip = this.getNode(anchor, this.id);
    toolTip.innerHTML = String(renderData[this.id].value);
    toolTip.style.left = -offset + 'px';
  }
}

class vTooltip extends Tooltip {
  render(anchor: HTMLElement, renderData: RenderData): void {
    if (renderData[this.id] === undefined) return;
    const toolTip = this.getNode(anchor, this.id);
    toolTip.innerHTML = String(renderData[this.id].value);
  }
}

export { hTooltip, vTooltip };