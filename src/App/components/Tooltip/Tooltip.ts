import { HORIZONTAL_SLIDER, VERTICAL_SLIDER } from '../../../Helpers/Constants';
import { Component, RenderData, State } from '../../../Helpers/Interfaces';

class Tooltip implements Component {
  private template = '';

  private position = 0;

  constructor(private anchor: HTMLElement, state: State, private id: number = 0) {
    this.create(state);
  }

  create(state: State): void {
    this._setTemplate(state);
    this.getRootElement().insertAdjacentHTML('beforeend', this.template);
  }

  getNode(): HTMLElement {
    const node = this.anchor.querySelector(`.slider__tooltip[data-id="${this.id}"]`) as HTMLElement;
    if (!node) throw new Error(`tooltip wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getRootElement(): HTMLElement {
    const root = this.anchor.querySelector(`.slider__handle[data-id="${this.id}"]`) as HTMLElement;
    if (!root) throw new Error('Hanlde was not found');
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
    let direction = '';
    let rotateValue = 0;
    if (renderData.coords[this.id]?.valuePxValue.value !== this.position) {
      direction = this.position < renderData.coords[this.id]?.valuePxValue.value ? 'right' : 'left';
      this.position =
        renderData.coords[this.id]?.valuePxValue.value === this.position
          ? this.position
          : renderData.coords[this.id]?.valuePxValue.value;
    }
    if (direction === 'right') {
      rotateValue = -15;
    } else if (direction === 'left') {
      rotateValue = 15;
    } else {
      rotateValue = 0;
    }

    const finishTransform = (e) => {
      setTimeout(() => {
        e.target.style.transition = '';
        e.target.style.transform = 'rotate(0deg)';
      }, 300);
    };

    const OFFSET_FACTOR = 4;
    const numbersAmount = String(renderData.coords[this.id]?.valuePxValue.value).length - 1;
    const offset = numbersAmount * OFFSET_FACTOR;

    const toolTip = this.getNode();
    toolTip.innerHTML = String(renderData.coords[this.id]?.valuePxValue.value);
    toolTip.style[side] = `${-offset}px`;
    if (renderData.position === 'horizontal') {
      toolTip.style.transition = 'transform 0.3s ease';
      toolTip.style.transform = `rotate(${rotateValue}deg)`;
      toolTip.style.transformOrigin = '55% 100%';
      toolTip.addEventListener('transitionend', finishTransform, { once: true });
    }
  }

  private _setTemplate(state: State): void {
    if (!state.position) throw new Error("position in params wasn't found");
    const value = state.value[0];
    if (state.type === 'single') {
      this.position = value;
    }
    const modifer = `slider__tooltip slider__tooltip_position-${state.position}`;
    this.template = `<div class="slider__tooltip ${modifer}" data-component="tooltip" data-id=${this.id}>0</div>`;
  }
}

export default Tooltip;
