import { timeStamp } from "console";
import { Component, State } from "../../../Helpers/Interfaces";

export class Scale implements Component {
  template: string = `<div class="slider__scale"></div>`;
  flag: boolean = true;
  constructor(params: State) {
    this.setTemplate(params.type);
  }

  create(anchor: Element | HTMLElement): this {
    let el = this.getRootElement(anchor);
    el.insertAdjacentHTML('beforeend', this.template);
    return this;
  }

  setTemplate(type: string, template?: any): void {
    const className = `slider__scale slider__scale_${type}`;
    this.template = template !== undefined ? template : `<div class="${className}" data-component="scale"></div>`;
  }

  update(anchor: Element | HTMLElement, renderParams: any): void {

    if (this.getNode(anchor)) {
      let scale = (<HTMLElement>this.getNode(anchor));
      if (renderParams.position === 'horizontal' && this.flag) {
        let content = '';
        renderParams.scaleValues.forEach( value => {
          content += `<div class="slider__scale-item" style="left: ${value + 1}px">${value}</div>`;
        });
        let template = `<div class="slider__scale">${content}</div>`;
        this.setTemplate('horizontal', template);
        this.create(anchor);
        this.flag = false;
      } else {
        
        // scale.style.top = renderParams[id].correctPxValue + 'px';
      }
    }
  }

  getNode(anchor: HTMLElement | Element): Element {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector(`.slider__scale`);
    if (!node) throw new Error(`scale wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name;
  }

  private getRootElement(anchor: Element): Element {
    const el = anchor.querySelector('.slider');
    if (!el) throw new Error ('Hanlde was not found');
    return el;
  }
}