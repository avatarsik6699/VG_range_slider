import { Component, RenderData } from "../../../Helpers/Interfaces";

interface ScaleInterface {
  render(anchor: HTMLElement, renderData: RenderData): void 
}

abstract class Scale implements Component {
  protected isInit: boolean = false;
  protected template: string = '<div class="slider__scale"></div>';
  constructor(anchor: HTMLElement, params: {position: string}) {
    this.create(anchor, params);
  }

  create(anchor: HTMLElement, params: {position: string}): void { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
  }

  
  getNode(anchor: HTMLElement): HTMLElement {
    const node = anchor.querySelector(`.slider__scale`) as HTMLElement;
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  abstract render(anchor: HTMLElement, renderData: RenderData): void;

  protected setTemplate(params: {position: string}): void {
    if(!params.position) throw new Error(`position wasn't found in params`);
    const modifer = `slider__scale slider__scale_position-${params.position}`;
    this.template = `<div class="slider__scale ${modifer}" data-component="scale"></div>`;
  }

  getRootElement(anchor: HTMLElement): HTMLElement {
    const root: HTMLElement | null = anchor.querySelector('.slider');
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }
}

class hScale extends Scale implements ScaleInterface {
  render(anchor: HTMLElement, renderData: RenderData): void {
    if (renderData.scaleValues === undefined) throw new Error('scaleValues not found')
    if (!this.isInit) {
      const scale = this.getNode(anchor);
      let content: string = ``;
      
      renderData.scaleValues.forEach( (values) => {
        content += `
        <div class="slider__scale-item" style="left: ${values.pxValue}px">${values.value}</div>`
      })
      scale.insertAdjacentHTML('afterbegin', content);
      this.isInit = true;
    }
  }
}

class vScale extends Scale implements ScaleInterface {
  render(anchor: HTMLElement, renderData: RenderData): void {
    if (renderData.scaleValues === undefined) throw new Error('scaleValues not found')
    if (!this.isInit) {
      const scale = this.getNode(anchor);
      let content: string = ``;
      
      renderData.scaleValues.forEach( (values) => {
        content += `
        <div class="slider__scale-item" style="top: ${values.pxValue}px">${values.value}</div>`
      });
      
      scale.insertAdjacentHTML('afterbegin', content);
      this.isInit = true;
    }
  }
}

export { hScale, vScale };