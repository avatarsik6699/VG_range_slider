import { EVENT_TRIGGERED } from '../../../Helpers/Constants';
import { Component, State } from '../../../Helpers/Interfaces';
import Observer from '../../../Helpers/Observer';

class Slider extends Observer implements Component {
  private template = `<div class="slider"></div>`;

  constructor(private anchor: HTMLElement, state: State) {
    super();
    this.create(state);
    this.bindEvents();
  }

  create(state: { position: string }): void {
    this._setTemplate(state);
    this.getRootElement().insertAdjacentHTML('afterbegin', this.template);
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(): HTMLElement {
    const node = this.anchor.querySelector('.slider') as HTMLElement;
    if (!node) throw new Error(`slider wasn't found`);
    return node;
  }

  getRootElement(): HTMLElement {
    const root = this.anchor;
    if (!root) throw new Error(`root 'Slider' wasn't found`);
    return root;
  }

  private bindEvents() {
    const eventHandler = (ev) => {
      const { appData } = ev.detail;
      const { handlesPxValue } = ev.detail;
      this.notify('touchEvent', {
        action: EVENT_TRIGGERED,
        eventType: 'touch',
        pxValue: handlesPxValue,
        ...appData,
      });
    };
    this.getNode().addEventListener('sliderEvent', eventHandler);
    // sliderEvent(e: MouseEvent | TouchEvent) {
    //   const target = e.target as HTMLElement;
    //   const appData = this._getAppData(e);
    //   if (target.closest(`[data-component="scale"]`)) {
    //     this._scaleEvent(e);
    //   } else if (target.dataset.component !== 'handle') {
    //     const appData = this._getAppData(e);
    //     const handlesPxValues = this._getHandlesPxValues(e, appData.id);
    //     this.notify('touchEvent', {
    //       action: EVENT_TRIGGERED,
    //       eventType: 'touch',
    //       pxValue: handlesPxValues,
    //       ...appData,
    //     });
    //   } else {
    //     const handleMove = (e: MouseEvent | TouchEvent): void => {
    //       const handlesPxValues = this._getHandlesPxValues(e, appData.id);
    //       this.notify('moveEvent', { action: EVENT_TRIGGERED, pxValue: handlesPxValues, ...appData });
    //     };

    //     const finishMove = (): void => {
    //       document.removeEventListener('mousemove', handleMove);
    //       document.removeEventListener('mouseup', finishMove);
    //       document.removeEventListener('touchmove', handleMove);
    //       document.removeEventListener('touchend', finishMove);
    //     };

    //     if (e instanceof TouchEvent) {
    //       e.preventDefault();
    //       document.addEventListener('touchmove', handleMove);
    //       document.addEventListener('touchend', finishMove);
    //     } else {
    //       e.preventDefault();
    //       document.addEventListener('mousemove', handleMove);
    //       document.addEventListener('mouseup', finishMove);
    //     }

    //     this.getNodes('handle').forEach((handle) => {
    //       handle.ondragstart = () => false;
    //     });
    //   }
    // }
  }

  private _setTemplate(state: { position: string }) {
    if (!state.position) throw new Error("position wasn't found in params");
    const modifer = `slider_position-${state.position}`;
    this.template = `
    <div class="slider-wrapper slider-wrapper_${state.position}">
      <div class="slider ${modifer}" data-component="slider"></div>
    </div>`;
  }
}

export default Slider;
