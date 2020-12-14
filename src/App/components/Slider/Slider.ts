import { Component } from "../../../Helpers/Interfaces";

class Slider implements Component {
  private template: string = `<div class="slider"></div>`;
  constructor(anchor: HTMLElement, state: {position: string}) {
    this.create(anchor, state);
  }

  create(anchor: HTMLElement, state: {position: string}) { 
    this._setTemplate(state);
    this.getRootElement(anchor).insertAdjacentHTML('afterbegin', this.template);
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(anchor: HTMLElement) {
    let node = anchor.querySelector('.slider') as HTMLElement;
    if (!node) throw new Error(`slider wasn't found`);
    return node;
  }

  getRootElement(anchor: HTMLElement) {
    const root = anchor;
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }
  
  private _setTemplate (state: {position: string}) {
    if (!state.position) throw new Error('position wasn\'t found in params')
    const modifer = `slider_position-${state.position}`
    this.template = `
    <div class="slider-wrapper slider-wrapper_${state.position}">
      <div class="slider ${modifer}" data-component="slider"></div>
    </div>`;
  }
}

export { Slider };