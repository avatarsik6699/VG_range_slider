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
    this.bindBasicEvents();
    this.app.create(this.core.getState());
  }

  bindBasicEvents(): void {
    this.app.subscribe('finishCreate', () => this.bindComponentEvents());
    this.app.subscribe('finishCreate', () => this.app.bindEvents());
    this.app.subscribe('finishCreate', (data: AppData) => this.core.appDataHandler(data));

    this.core.subscribe('getRenderData', (renderData: RenderData) => this.app.renderApp(renderData));
    this.core.subscribe('recrateApp', (state: State) => this.app.reCreate(state));
    this.core.subscribe('getRenderData', () => {
      this.anchor.dispatchEvent(new CustomEvent('getState', { detail: this.core.getState() }));
    });
  }

  bindComponentEvents(): void {
    const componentEventList = {
      settings: 'settingsEvent',
      scale: 'scaleEvent',
      handle: 'moveEvent',
      slider: 'touchEvent',
    };

    Object.keys(this.app.instances).forEach((name) => {
      if (componentEventList[name] && name !== 'settings') {
        this.app
          .getComponent(name)
          .subscribe?.(componentEventList[name], (appData: AppData) => this.core.appDataHandler(appData));
      }
      if (name === 'settings') {
        this.app
          .getComponent(name)
          .subscribe?.(componentEventList[name], (data: State) =>
            this.core.setState(data, { value: data.value, action: data.action }),
          );
      }
    });
  }
}

export default Controller;
