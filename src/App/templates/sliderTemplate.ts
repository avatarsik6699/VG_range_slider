import { Template } from "../../Helpers/Interfaces";

const sliderTemplate: Template = {
  template: `
  <div class="slider-wrapper">
    <div class="slider">
    </div>
  </div>`,
  render(anchor: Element): void {
    anchor.insertAdjacentHTML('afterbegin', this.template);
  },

  getNode(anchor: Element): Element {
    const slider = anchor.querySelector('.slider');
    if (!slider) { throw new Error(`Item not found. Maybe you didn't call the 'render' method`) };
    return slider;
  }
}

export {sliderTemplate};