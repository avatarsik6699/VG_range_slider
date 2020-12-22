import { HORIZONTAL_SLIDER, VERTICAL_SLIDER } from '../../../Helpers/Constants';
import { Component, RenderData, State } from '../../../Helpers/Interfaces';

class Handle implements Component {
  private template = '';

  constructor(private anchor: HTMLElement, state: State, private id: number = 0) {
    this.create(state);
  }

  create(state: { position: string; value: number[] }): void {
    this.setTemplate(state);
    this.getRootElement().insertAdjacentHTML('beforeend', this.template);
  }

  getNode(): HTMLElement {
    const node = this.anchor.querySelector(`.slider__handle[data-id="${this.id}"]`) as HTMLElement;
    if (!node) throw new Error(`handle wasn't found`);
    return node;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.toLowerCase();
  }

  getRootElement(): HTMLElement {
    const root = this.anchor.querySelector('.slider') as HTMLElement;
    if (!root) throw new Error("Root wasn't found");
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
    const handle = this.getNode();
    if (renderData.eventType === 'touch' && renderData.targetId === this.id) {
      const removeTransition = () => (handle.style.transition = '');
      handle.style.transition = `${side} 0.2s ease`;
      handle.addEventListener('transitionend', removeTransition, { once: true });
    }

    handle.dataset.value = String(renderData.coords[this.id]?.valuePxValue.value) ?? handle.dataset.value;
    handle.style[side] = `${renderData.coords[this.id]?.valuePxValue.px}px`;
  }

  private setTemplate(state: { position: string; value: number[] }): void {
    if (state.position === undefined && state.value === undefined) {
      throw new Error("incorrect params: wasn't found position or value");
    }
    const INITIAL_VALUE = 0;
    const modifer = `slider__handle slider__handle_position-${state.position}`;
    const value = state.value[this.id] ?? INITIAL_VALUE;
    this.template = `
    <div class="slider__handle ${modifer}" data-component="handle" data-id=${this.id} data-value=${value}></div>
    `;
  }
}

export default Handle;
