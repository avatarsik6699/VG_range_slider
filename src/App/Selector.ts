import { HorizontalSlider } from "./factories/horizontalSlider";
import { VerticalSlider } from "./factories/VerticalSlider";

export class Selector {
  constructor() {}
  getFactory(params: {position: string} = {position: 'horizontal'}) {
    if (params.position === 'horizontal') return new HorizontalSlider;
    if (params.position === 'vertical') return new VerticalSlider;
  }
}