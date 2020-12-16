import { HORIZONTAL_SLIDER, VERTICAL_SLIDER } from '../../../Helpers/Constants';
import { Component, RenderData } from '../../../Helpers/Interfaces';

class Bar implements Component {
  private template = '';

  constructor(anchor: HTMLElement, state: { position: string }) {
    this.create(anchor, state);
  }

  create(anchor: HTMLElement, state: { position: string }) {
    this._setTemplate(state);
    this.getRootElement(anchor).insertAdjacentHTML('beforeend', this.template);
  }

  render(anchor: HTMLElement, renderData: RenderData): void {
    if (renderData.type === undefined || renderData.handleSize === undefined) {
      throw new Error("type or handleSize wasn't found in renderData");
    }
    switch (renderData.position) {
      case HORIZONTAL_SLIDER:
        this._update('left', 'width', renderData, anchor);
        break;
      case VERTICAL_SLIDER:
        this._update('top', 'height', renderData, anchor);
        break;
    }
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(anchor: HTMLElement): HTMLElement {
    const node = anchor.querySelector('.slider__bar') as HTMLElement;
    if (!node || node === undefined) throw new Error("Bar wasn't found");
    return node;
  }

  getRootElement(anchor: HTMLElement): HTMLElement {
    const root = anchor.querySelector('.slider') as HTMLElement;
    if (!root) throw new Error(`root 'Slider' wasn't found`);
    return root;
  }

  private _setTemplate(state: { position: string }): void {
    if (state.position === undefined) throw new Error("position wasn't found or incorrect");
    const modifer = `slider__bar_position-${state.position}`;
    this.template = `<div class="slider__bar ${modifer}" data-component="bar"></div>`;
  }

  private _getPxValue(renderData: RenderData): number | number[] {
    if (renderData.type === 'single') {
      return renderData[0].pxValue;
    }
    return [renderData[0].pxValue, renderData[1].pxValue];
  }

  private _update(side, size, renderData, anchor) {
    const START_PX = '0px';
    const { type } = renderData;
    const { handleSize } = renderData;
    const px = this._getPxValue(renderData);
    const bar = this.getNode(anchor);
    if (type === 'single') {
      bar.style[side] = START_PX;
      bar.style[size] = `${px + handleSize}px`;
    } else {
      bar.style[size] = `${Math.abs(px[0] - px[1]) + handleSize}px`;
      bar.style[side] = px[0] < px[1] ? `${px[0]}px` : `${px[1]}px`;
    }
  }
}

export { Bar };
