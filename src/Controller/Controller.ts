import { Core } from "../Core/Core";
import { App } from "../App/App";
import { FactorySelector } from "../App/FactorySelector";
import { AppData, RenderData, State } from "../Helpers/Interfaces";
export class Controller {
  core: Core;
  app: App;
  constructor(anchor: HTMLElement, settings: State) 
  {
    this.core = new Core(settings);
    this.app = new App(anchor, this.core.getState(), new FactorySelector) 
    this.bindEvents();
    this.app.bindEvents();
  }

  bindEvents() {
    this.app.subscribe('finishCreate', (appData: AppData) => this.core.getRenderData(appData));
    this.app.subscribe('touchEvent', (appData: AppData) => this.core.getRenderData(appData));
    this.app.subscribe('settingsEvent', (state: State) => this.core.setState(state));
    this.app.subscribe('moveEvent', (appData: AppData) => this.core.getRenderData(appData));
    this.app.subscribe('scaleEvent', (appData: AppData) => this.core.getRenderData(appData));

    this.core.subscribe('getRenderData', (renderData: RenderData) => this.app.renderUI(renderData));
    this.core.subscribe('updateState', (state: State) => this.app.reCreate(state));
  }
}