import { IFactory } from '../Helpers/Interfaces';
import Factory from './factories/Factory';

class FactorySelector {
  static getFactory(): IFactory {
    return new Factory();
  }
}

export type IFactorySelector = typeof FactorySelector;

export default FactorySelector;
