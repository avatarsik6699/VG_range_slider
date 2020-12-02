import { HorizontalSlider } from "./factories/horizontalSlider";
import { VerticalSlider } from "./factories/VerticalSlider";

class FactorySelector {
  getFactory(position: string) {
    if (!this._isCorrectPosition(position)) {
      throw new Error('Didn\'t get position or mistake position')
    }
  
    return position === 'horizontal'
    ? new HorizontalSlider
    : new VerticalSlider
  }

  _isCorrectPosition(position: string): boolean {
    const correctPosition = ['horizontal', 'vertical'];
    return typeof position == 'string' && correctPosition.includes(position);
  }
}

export { FactorySelector }