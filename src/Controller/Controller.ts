import { Core } from "../Core/Core";
import { App } from "../App/App";
import { Selector } from "../App/Selector";
export class Controller {
  core: Core;
  app: App;
  constructor(private anchor: HTMLElement, private options: {}) 
  {
    this.core = new Core(options);
    this.app = new App(anchor, this.core.getState(), new Selector())
    this.app.init(this.core.getState());
  }
}