import { Factory } from "./factories/Factory";

class FactorySelector {
  getFactory(position: string) {
    if (!this._isCorrectPosition(position)) {
      throw new Error('Didn\'t get position or mistake position')
    }
    
    return new Factory;
  }

  _isCorrectPosition(position: string): boolean {
    const correctPosition = ['horizontal', 'vertical'];
    return typeof position == 'string' && correctPosition.includes(position);
  }
}

export { FactorySelector }