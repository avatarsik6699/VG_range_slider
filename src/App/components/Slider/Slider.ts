import { Component, RenderData, State } from "../../../Helpers/Interfaces";

class Slider implements Component {
  protected template: string = `
  <div class="slider-wrapper">
    <div class="slider">
    </div>
  </div>`;
  constructor(anchor: HTMLElement, params: {position: string}) {
    this.create(anchor, params);
  }

  create(anchor: HTMLElement, params: {position: string}) { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('afterbegin', this.template);
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(anchor: HTMLElement): HTMLElement {
    let node = anchor.querySelector('.slider') as HTMLElement;
    if (!node) throw new Error(`slider wasn't found`);
    return node;
  }

  getRootElement(anchor: HTMLElement): HTMLElement {
    const root = anchor;
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }

  render(anchor: HTMLElement, renderData: RenderData): void {}
  
  protected setTemplate (params: {position: string}) {
    if (!params.position) throw new Error('position wasn\'t found in params')
    const modifer = `slider_position-${params.position}`
    this.template = `
    <div class="slider-wrapper">
      <div class="slider ${modifer}" data-component="slider">
      </div>
    </div>`;
  }
}

export { Slider };