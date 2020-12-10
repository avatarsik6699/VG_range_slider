import { Component, RenderData } from "../../../Helpers/Interfaces";
class Tooltip implements Component {
  private template: string = '';
  constructor(anchor: HTMLElement, state: {position: 'horizontal'}, private id: number) {
    this.create(anchor, state);
  }

  create(anchor: HTMLElement, state: {position: string}) { 
    this._setTemplate(state);
    this.getRootElement(anchor).insertAdjacentHTML('beforeend', this.template);
  }

  getNode(anchor: HTMLElement) {
    const node = anchor.querySelector(`.slider__tooltip[data-id="${this.id}"]`) as HTMLElement;
    if (!node) throw new Error(`tooltip wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getRootElement(anchor: HTMLElement) {
    const root = anchor.querySelector(`.slider__handle[data-id="${this.id}"]`) as HTMLElement;
    if (!root) throw new Error ('Hanlde was not found');
    return root;
  }

  render(anchor: HTMLElement, renderData: RenderData): void {
    switch(renderData.position) {
      case 'horizontal':
        this._update('left', renderData, anchor)
        break
      case 'vertical':
        this._update('top', renderData, anchor)
        break
    }
  };

  private _update(side, renderData, anchor) {
    const OFFSET_FACTOR = 4
    const numbersAmount = String(renderData[this.id].value).length - 1;
    const offset = numbersAmount * OFFSET_FACTOR;
    const toolTip = this.getNode(anchor);
    toolTip.innerHTML = String(renderData[this.id].value);
    toolTip.style[side] = -offset + 'px';
  }

  private _setTemplate(state: {position: string}): void {
    if(!state.position) throw new Error('position in params wasn\'t found')
    const modifer = `slider__tooltip slider__tooltip_position-${state.position}`;
    this.template = `<div class="slider__tooltip ${modifer}" data-component="tooltip" data-id=${this.id}>0</div>`;
  }
}

export { Tooltip };