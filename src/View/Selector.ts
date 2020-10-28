import { HorizontalSlider } from "./factories/horizontalSlider";
import { VerticalSlider } from "./factories/VerticalSlider";

export class Selector {
  constructor() {}
  getFactory(position: string) {
    if (position === 'horizontal') {
      return new HorizontalSlider();
    } else if (position === 'vertical') {
      return new VerticalSlider();
    }
  }
}