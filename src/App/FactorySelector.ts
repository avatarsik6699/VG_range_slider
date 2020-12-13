import { Factory } from "./factories/Factory";

class FactorySelector {
  getFactory() {
    return new Factory;
  }
}

export { FactorySelector }