import { Model } from "../Core/Model";
import { App } from "../App/App";
import { Selector } from "../App/Selector";
export class Controller {
  model: Model;
  app: App;
  constructor(private anchor: HTMLElement, private options: {}) {
    this.model = new Model(options);
    this.app = new App(anchor, this.model.defaultState, new Selector)
  }
}