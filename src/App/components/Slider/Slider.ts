import { Component, State } from '../../../Helpers/Interfaces';
import Observer from '../../../Helpers/Observer';

class Slider extends Observer implements Component {
  private template = `<div class="slider"></div>`;

  constructor(private anchor: HTMLElement, state: State) {
    super();
    this.create(state);
  }

  create(state: { position: string }): void {
    this._setTemplate(state);
    this.getRootElement().insertAdjacentHTML('afterbegin', this.template);
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(): HTMLElement {
    const node = this.anchor.querySelector('.slider') as HTMLElement;
    if (!node) throw new Error(`slider wasn't found`);
    return node;
  }

  getRootElement(): HTMLElement {
    const root = this.anchor;
    if (!root) throw new Error(`root 'Slider' wasn't found`);
    return root;
  }

  private _setTemplate(state: { position: string }) {
    if (!state.position) throw new Error("position wasn't found in params");
    const modifer = `slider_position-${state.position}`;
    this.template = `
    <div class="slider-wrapper slider-wrapper_${state.position}">
      <div class="slider ${modifer}" data-component="slider"></div>
    </div>`;
  }
}

export default Slider;
