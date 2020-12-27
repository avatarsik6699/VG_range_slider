import { EVENT_TRIGGERED, HORIZONTAL_SLIDER, VERTICAL_SLIDER } from '../../../Helpers/Constants';
import { Component, RenderData, State } from '../../../Helpers/Interfaces';
import Observer from '../../../Helpers/Observer';

class Scale extends Observer implements Component {
  private isInit = false;

  private template = '<div class="slider_scale"></div>';

  constructor(private anchor: HTMLElement, state: State) {
    super();
    this.create(state);
    this.bindEvents();
  }

  create(state: { position: string }): void {
    this.setTemplate(state);
    this.getRootElement().insertAdjacentHTML('beforeend', this.template);
  }

  getNode(): HTMLElement {
    const node = this.anchor.querySelector(`.slider__scale`) as HTMLElement;
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getRootElement(): HTMLElement {
    const root = this.anchor.querySelector('.slider') as HTMLElement;
    if (!root) throw new Error(`Root wasn't found`);
    return root;
  }

  render(renderData: RenderData): void {
    switch (renderData.position) {
      case HORIZONTAL_SLIDER:
        this.update('left', renderData);
        break;
      case VERTICAL_SLIDER:
        this.update('top', renderData);
        break;
    }
  }

  private update(side: string, renderData: RenderData) {
    if (renderData.scaleValues === undefined) throw new Error('scaleValues not found');
    if (!this.isInit) {
      const scale = this.getNode();
      const DEFAULT_OFFSET = 4;
      const OFFSET_FACTOR = 6;
      let content = ``;

      renderData.scaleValues.forEach((valuePxValue) => {
        const offset =
          renderData.position === 'horizontal'
            ? OFFSET_FACTOR - (String(valuePxValue.value).length - 1) * DEFAULT_OFFSET
            : DEFAULT_OFFSET;
        content += `
        <div class="slider__scale-item" style="${side}: ${valuePxValue.px + offset}px">${valuePxValue.value}</div>`;
      });

      scale.insertAdjacentHTML('afterbegin', content);
      this.isInit = true;
    }
  }

  private bindEvents() {
    const eventHandler = (customEv) => {
      const scaleValue = Number(customEv.detail.target.textContent);
      const { handlesValue } = customEv.detail;
      const { appData } = customEv.detail;

      // меняем value по id у того handle, который должен переместиться
      handlesValue.splice(appData.id, 1, scaleValue);

      this.notify('scaleEvent', { action: EVENT_TRIGGERED, eventType: 'touch', value: handlesValue, ...appData });
    };
    this.getNode().addEventListener('scaleEvent', eventHandler);
  }

  private setTemplate(state: { position: string }): void {
    if (!state.position) throw new Error(`position wasn't found in params`);
    const modifer = `slider__scale slider__scale_position-${state.position}`;
    this.template = `<div class="slider__scale ${modifer}" data-component="scale"></div>`;
  }
}

export default Scale;
