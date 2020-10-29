import { Model } from "../Model/Model";
import { App } from "../View/App";
import { Selector } from "../View/Selector";
export class Controller {
  model: Model;
  app: App;
  constructor(private anchor: HTMLElement, private options: {}) {
    this.model = new Model(options);
    this.app = new App(anchor, this.model.defaultState, new Selector)
  }
}