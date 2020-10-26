import { setTextRange } from "typescript";
import { component } from "../component_interface";

export class Handle implements component {
  template: string = `<div class="slider__handle"></div>`;
  constructor(type: string) {
    this.setTemplate(type);
  }

  paint(anchor: Element): void {
    anchor.insertAdjacentHTML('beforeend', this.template);
  }

  setTemplate(type: string): void {
    const className = `slider__handle slider__handle_${type}`;
    this.template = `<div class=${className}></div>`;
  }
}