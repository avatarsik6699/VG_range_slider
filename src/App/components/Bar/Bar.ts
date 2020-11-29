import { Component, RenderData } from "../../../Helpers/Interfaces";

interface BarInterface {
  render(anchor: HTMLElement, renderData: RenderData): void;
}

abstract class Bar implements Component {
  protected template: string = '';
  constructor(anchor: HTMLElement, params: {position: string}) {
    this.create(anchor, params);
  }

  create(anchor: HTMLElement, params: {position: string}) {
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(anchor: HTMLElement): HTMLElement {
    const node: HTMLElement | null = anchor.querySelector('.slider__bar');
    if (!node || node === undefined) { 
      throw new Error(`Bar wasn't found. 
      Also, for this to work, you must call the 'create' method`);
    }

    return node;
  }

  getRootElement(anchor: Element): Element {
    const root = anchor.querySelector('.slider');
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }

  abstract render(anchor: HTMLElement, renderData: RenderData): void;

  protected setTemplate (params: {position: string}): void {
    if (typeof params.position !== 'string' || !params.position) {
      throw new Error('position wasn\'t found or incorrect')
    }

    const modifer = `slider__bar_position-${params.position}`
    this.template = `<div class="slider__bar ${modifer}" data-component="bar"></div>`;
  }

  protected getPxValue(renderData: RenderData): number | number[] {
    if (renderData.type === 'single') {
      return renderData[0]['pxValue'];
    } else {
      return [renderData[0].pxValue, renderData[1].pxValue]
    }
  }
}

class hBar extends Bar implements BarInterface {
  render(anchor: HTMLElement, renderData: RenderData): void {
    if (renderData.type === undefined || renderData.handleSize === undefined) {
      throw new Error('type or handleSize wasn\'t found in renderData');
    }

    const bar = this.getNode(anchor);
    const pxValue = this.getPxValue(renderData) as number;
    if (renderData.type === 'single') {
      bar.style.left = 0 + 'px';
      bar.style.width = pxValue + renderData.handleSize + 'px';
    } else {
      bar.style.width = Math.abs(pxValue[0] - pxValue[1]) + renderData.handleSize +'px';
      bar.style.left = pxValue[0] < pxValue[1] ? pxValue[0] + 'px' : pxValue[1] + 'px' 
    }
  }
}

class vBar extends Bar implements BarInterface  {
  render(anchor: HTMLElement, renderData: RenderData): void {
    if (renderData.type === undefined) throw new Error('type wasn\'t found in renderData');
    const bar = this.getNode(anchor);
    const pxValue = this.getPxValue(renderData);
    if (renderData.type === 'single') {
      bar.style.top = 0 + 'px';
      bar.style.height = (pxValue as number) + renderData.handleSize + 'px';
    } else {
      bar.style.height = Math.abs(pxValue[0] - pxValue[1]) + renderData.handleSize +'px';
      bar.style.top = pxValue[0] < pxValue[1] ? pxValue[0] + 'px' : pxValue[1] + 'px' 
    }
  }
}

export { hBar, vBar };