import { Component, State } from "../../../Helpers/Interfaces";

abstract class Scale {
  protected isInit: boolean = false;
  protected template: string = '<div class="slider__scale"></div>';
  constructor(anchor: Element | HTMLElement, params: State) {
    this.create(anchor, params);
  }

  create(anchor: Element | HTMLElement, params: State): this { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
    return this;
  }

  
  getNode(anchor: HTMLElement | Element): Element | HTMLElement {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector(`.slider__scale`);
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.slice(1);
  }

  abstract update(anchor: Element | HTMLElement, renderData: any): void;

  protected setTemplate(params: State): void {
    const modifer = `slider__scale slider__scale_position-${params.position}`;
    this.template = `<div class="slider__scale ${modifer}" data-component="scale"></div>`;
  }

  protected getRootElement(anchor: Element): Element {
    const root = anchor.querySelector('.slider');
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }
}

class hScale extends Scale {
  update(anchor: Element | HTMLElement, renderData: any): void {
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

class vScale extends Scale {
  update(anchor: Element | HTMLElement, renderData: any): void {
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