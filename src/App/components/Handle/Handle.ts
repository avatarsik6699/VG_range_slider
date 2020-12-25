import { EVENT_TRIGGERED, HORIZONTAL_SLIDER, VERTICAL_SLIDER } from '../../../Helpers/Constants';
import { Component, RenderData, State } from '../../../Helpers/Interfaces';
import Observer from '../../../Helpers/Observer';

class Handle extends Observer implements Component {
  private template = '';

  constructor(private anchor: HTMLElement, state: State, private id: number = 0, private parentMethods: any) {
    super();
    this.create(state);
    this.bindEvents();
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

  private bindEvents() {
    const eventHandler = (customEv) => {
      const { handles } = customEv.detail;
      const { parentEv } = customEv.detail;
      const appData = this.parentMethods.getAppData(parentEv);
      const handleMove = (moveEvent): void => {
        const handlesPxValue = this.parentMethods.getHandlesPxValues(moveEvent, appData.id);
        this.notify('moveEvent', { action: EVENT_TRIGGERED, pxValue: handlesPxValue, ...appData });
      };

      const finishMove = (): void => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', finishMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', finishMove);
      };

      if (parentEv instanceof TouchEvent) {
        parentEv.preventDefault();
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', finishMove);
      } else {
        parentEv.preventDefault();
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', finishMove);
      }

      handles.forEach((handle) => (handle.ondragstart = () => false));
    };
    this.getNode().addEventListener('handleEvent', eventHandler);
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
