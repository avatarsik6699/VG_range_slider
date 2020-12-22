import Core from '../Core/Core';
import App from '../App/App';
import FactorySelector from '../App/FactorySelector';
import { AppData, RenderData, State } from '../Helpers/Interfaces';

class Controller {
  core: Core;

  app: App;

  constructor(private anchor: HTMLElement, settings: State) {
    this.core = new Core(settings);
    this.app = new App(anchor, FactorySelector);
    this.bindEvents();
    this.app.create(this.core.getState());
    this.app.bindEvents();
  }

  bindEvents(): void {
    this.app.subscribe('finishCreate', (data: AppData) => this.core.setState(data));
    this.app.subscribe('touchEvent', (appData: AppData) => this.core.setState(appData));
    this.app.subscribe('settingsEvent', (state: State) => this.core.setState(state));
    this.app.subscribe('moveEvent', (appData: AppData) => this.core.setState(appData));
    this.app.subscribe('scaleEvent', (appData: AppData) => this.core.setState(appData));
    // this.app.getComponent('slider').subscribe('touchEvent', (appData: AppData) => this.core.setState(appData));
    // this.app.getComponent('slider').subscribe('moveEvent', (appData: AppData) => this.core.setState(appData));

    this.core.subscribe('getRenderData', (renderData: RenderData) => this.app.renderUI(renderData));
    this.core.subscribe('updateState', (state: State) => this.app.reCreate(state));
    this.core.subscribe('getRenderData', () => {
      this.anchor.dispatchEvent(new CustomEvent('getState', { detail: this.core.getState() }));
    });
  }
}

export default Controller;
