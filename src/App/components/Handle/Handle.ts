import { HORIZONTAL_SLIDER, VERTICAL_SLIDER } from "../../../Helpers/Constants";
import { Component, RenderData } from "../../../Helpers/Interfaces";

class Handle implements Component {
  private template: string = '';
  constructor(anchor: HTMLElement, state: {position: string, value: number[]}, private id: number) {
    this.create(anchor, state);
  }

  create(anchor: HTMLElement, state: {position: string, value: number[]}): void { 
    this._setTemplate(state);
    this.getRootElement(anchor).insertAdjacentHTML('beforeend', this.template);
  }

  getNode(anchor: HTMLElement) {
    const node = anchor.querySelector(`.slider__handle[data-id="${this.id}"]`) as HTMLElement;
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getRootElement(anchor: HTMLElement) {
    const root = anchor.querySelector('.slider') as HTMLElement;
    if (!root) throw new Error ('Root wasn\'t found');
    return root;
  }

  render(anchor: HTMLElement, renderData: RenderData): void {
    switch(renderData.position) {
      case HORIZONTAL_SLIDER:
        this._update('left', renderData, anchor)
        break
      case VERTICAL_SLIDER:
        this._update('top', renderData, anchor)
        break
    }
  };

  private _update(side, renderData, anchor) {
    const handle = this.getNode(anchor);
    handle.dataset.value = String(renderData[this.id]?.value) ?? handle.dataset.value;
    handle.style[side] = renderData[this.id].pxValue + 'px';
  }

  private _setTemplate(state: {position: string, value: number[]}): void {
    if (state.position === undefined && state.value === undefined) {
      throw new Error('incorrect params: wasn\'t found position or value');
    }
    const INITIAL_VALUE = 0;
    const modifer = `slider__handle slider__handle_position-${state.position}`;
    const value = state.value[this.id] ?? INITIAL_VALUE;
    this.template = `
    <div class="slider__handle ${modifer}" data-component="handle" data-id=${this.id} data-value=${value}></div>
    `;
  }
}


export { Handle }