import { component } from "../component_interface";

export class Bar implements component {
  template: string = `<div class="slider__bar"></div>`;
  constructor(type: string) {
    this.setTemplate(type);
  }

  paint(anchor: Element): void {
    anchor.insertAdjacentHTML('beforeend', this.template);
  }

  setTemplate(type: string): void {
    const className = `slider__bar slider__bar_${type}`;
    this.template = `<div class=${className} data-component="bar"></div>`;
  }
}