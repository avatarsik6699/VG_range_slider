import { Core } from "../Core/Core";
import { App } from "../App/App";
import { FactorySelector } from "../App/FactorySelector";
import { State } from "../Helpers/Interfaces";
export class Controller {
  core: Core;
  app: App;
  constructor(anchor: HTMLElement) 
  {
    this.core = new Core; // изначально state = default;
    this.app = new App(anchor, this.core.getState(), new FactorySelector) 
    this.bindEvents();
    this.app.create(this.core.getState());
    this.app.bindEvents();
  }

  bindEvents() {
    this.app.subscribe('finishCreate', (appData) => this.core.getRenderData(appData));
    this.app.subscribe('touchEvent', (appData) => this.core.getRenderData(appData));
    this.app.subscribe('settingsEvent', (settings: State) => this.core.setState(settings));
    this.app.subscribe('moveEvent', (appData) => this.core.getRenderData(appData));

    this.core.subscribe('getRenderData', (renderData) => this.app.renderUI(renderData));
    this.core.subscribe('updateState', (state: State) => this.app.reCreate(state));
  }
}