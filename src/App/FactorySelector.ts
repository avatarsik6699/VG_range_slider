import Factory, { IFactory } from './factories/Factory';

class FactorySelector {
  static getFactory(): IFactory {
    return new Factory();
  }
}

export default FactorySelector;
