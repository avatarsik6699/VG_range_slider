import { HORIZONTAL_SLIDER, VERTICAL_SLIDER } from '../../../Helpers/Constants';
import { Component, RenderData, State } from '../../../Helpers/Interfaces';

class Bar implements Component {
  private template = '';

  constructor(private anchor: HTMLElement, state: State) {
    this.create(state);
  }

  create(state: { position: string }): void {
    this.setTemplate(state);
    this.getRootElement().insertAdjacentHTML('beforeend', this.template);
  }

  render(renderData: RenderData): void {
    if (renderData.type === undefined || renderData.handleSize === undefined) {
      throw new Error("type or handleSize wasn't found in renderData");
    }

    switch (renderData.position) {
      case HORIZONTAL_SLIDER:
        this.update('left', 'width', renderData);
        break;
      case VERTICAL_SLIDER:
        this.update('top', 'height', renderData);
        break;
    }
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getNode(): HTMLElement {
    const node = this.anchor.querySelector('.slider__bar') as HTMLElement;
    if (node === undefined) throw new Error("Bar wasn't found");
    return node;
  }

  getRootElement(): HTMLElement {
    const root = this.anchor.querySelector('.slider') as HTMLElement;
    if (!root) throw new Error(`root 'Slider' wasn't found`);
    return root;
  }

  private setTemplate(state: { position: string }): void {
    if (state.position === undefined) throw new Error("position wasn't found or incorrect");
    const modifer = `slider__bar_position-${state.position}`;
    this.template = `<div class="slider__bar ${modifer}" data-component="bar"></div>`;
  }

  private getPxValue(renderData: RenderData): number | number[] {
    const { targetId } = renderData;
    if (renderData.type === 'range') {
      return [renderData.coords[0].valuePxValue.px, renderData.coords[1].valuePxValue.px];
    }
    if (renderData.type === 'multiple') {
      const pxValues = Object.values(renderData.coords).map((handleCoords) => handleCoords.valuePxValue.px);
      const [left, right] = [Math.min(...pxValues), Math.max(...pxValues)];
      return [left, right];
    }
    return renderData.coords[targetId].valuePxValue.px;
  }

  private update(side: string, size: string, renderData: RenderData) {
    const START_PX = '0px';
    const { type } = renderData;
    const { handleSize } = renderData;
    const px = this.getPxValue(renderData);
    const bar = this.getNode();

    if (renderData.eventType === 'touch') {
      const removeTransition = () => {
        bar.style.transition = '';
      };
      bar.style.transition = `${side} 0.2s ease, ${size} 0.2s ease`;
      bar.addEventListener('transitionend', removeTransition, { once: true });
    }

    if (type === 'single') {
      bar.style[side] = START_PX;
      bar.style[size] = `${(px as number) + handleSize}px`;
    } else {
      bar.style[size] = `${Math.abs(px[0] - px[1]) + handleSize}px`;
      bar.style[side] = px[0] < px[1] ? `${px[0]}px` : `${px[1]}px`;
    }
  }
}

export default Bar;
