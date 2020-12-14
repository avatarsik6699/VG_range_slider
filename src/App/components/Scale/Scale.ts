import { off } from "process";
import { HORIZONTAL_SLIDER, VERTICAL_SLIDER } from "../../../Helpers/Constants";
import { Component, RenderData } from "../../../Helpers/Interfaces";

class Scale implements Component {
  private isInit: boolean = false;
  private template: string = '<div class="slider__scale"></div>';
  constructor(anchor: HTMLElement, state: {position: string}) {
    this.create(anchor, state);
  }

  create(anchor: HTMLElement, state: {position: string}): void { 
    this._setTemplate(state);
    this.getRootElement(anchor).insertAdjacentHTML('beforeend', this.template);
  }

  getNode(anchor: HTMLElement) {
    const node = anchor.querySelector(`.slider__scale`) as HTMLElement;
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getRootElement(anchor: HTMLElement) {
    const root: HTMLElement | null = anchor.querySelector('.slider');
    if (!root) throw new Error (`root 'Slider' wasn't found`);
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
    if (renderData.scaleValues === undefined) throw new Error('scaleValues not found')
    if (!this.isInit) {
      const scale = this.getNode(anchor);
      let content: string = ``;
     
      renderData.scaleValues.forEach( (values) => {
        let offset = renderData.position === 'horizontal'
        ? 6 - ( (String(values.value).length - 1) * 4)
        : 4
        content += `
        <div class="slider__scale-item" style="${side}: ${values.pxValue + offset}px">${values.value}</div>`
      });
      
      scale.insertAdjacentHTML('afterbegin', content);
      this.isInit = true;
    }
  }

  private _setTemplate(state: {position: string}): void {
    if(!state.position) throw new Error(`position wasn't found in params`);
    const modifer = `slider__scale slider__scale_position-${state.position}`;
    this.template = `<div class="slider__scale ${modifer}" data-component="scale"></div>`;
  }
}


export { Scale };