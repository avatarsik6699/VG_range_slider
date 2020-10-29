import { setTextRange } from "typescript";
import { component } from "../component_interface";

export class Handler implements component {
  template: string = `<div class="slider__handler"></div>`;
  constructor(type: string) {
    this.setTemplate(type);
  }

  paint(anchor: Element): void {
    anchor.insertAdjacentHTML('beforeend', this.template);
  }

  setTemplate(type: string): void {
    const className = `slider__handler slider__handler_${type}`;
    this.template = `<div class=${className} data-component="handler"></div>`;
  }

  getDomElement(anchor: Element): Element | null {
    return anchor.querySelector('div[data-component="handler"]');
  }
}