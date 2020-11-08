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
    this.bindEvents();
    this.app.init(this.core.getState());
    this.app.bindEvents();
  }

  bindEvents() {
    this.app.subscribe('finishInit', (appData) => {
      this.core.getRenderData(appData);
    })
    
    this.app.subscribe('touchEvent', (appData) => {
      this.core.getRenderData(appData);
    })

    this.core.subscribe('getRenderData', (renderData) => {
      this.app.renderUI(renderData);
    })

    this.app.subscribe('moveEvent', (appData) => {
      this.core.getRenderData(appData);
    })    
  }
}