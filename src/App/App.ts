import { HALF_HANDLE_SIZE, SLIDER_IS_CREATED } from '../Helpers/Constants';
import { Component, RenderData, State } from '../Helpers/Interfaces';
import Observer from '../Helpers/Observer';
import { IFactorySelector } from './FactorySelector';

type Coords = { [key: string]: number };

class App extends Observer {
  instances: { [key: string]: Component[] } = {};

  private position = 'horizontal';

  constructor(private anchor: HTMLElement, private FactorySelector: IFactorySelector) {
    super();
  }

  create(state: State): void {
    this.instances = this.createComponents(state);
    this.position = state.position;
    // после начальной отрисовки данные об сладйере отправляются в Core
    this.notify('finishCreate', { ...this.getAppData(), action: SLIDER_IS_CREATED });
  }

  reCreate(state: State): void {
    if (!this.isEmpty(this.anchor)) {
      this.destroy();
    }
    this.create(state);
  }

  renderApp(renderData: RenderData): void {
    Object.values(this.instances).forEach((instance) => {
      instance.forEach((subInstance) => (subInstance.render ? subInstance.render(renderData) : ''));
    });
  }

  bindEvents(): void {
    const initEvent = (parentEv: MouseEvent | TouchEvent) => {
      const handlesValue = this.getNodes('handle').map((handle) => Number(handle.dataset.value));
      const appData = this.getAppData(parentEv);
      const handlesPxValue = this.getHandlesPxValue(parentEv, appData.id);
      if ((parentEv.target as HTMLElement).closest('.slider__handle')) {
        const handleEvent = () => {
          this.getNode('handle').dispatchEvent(
            new CustomEvent('handleEvent', {
              detail: {
                parentEv,
                handlesPxValue,
                appData,
                handles: this.getNodes('handle'),
              },
            }),
          );
        };
        handleEvent();
        parentEv.target?.addEventListener('getDataForMove', handleEvent);
      } else if ((parentEv.target as HTMLElement).closest('.slider__scale')) {
        this.getNode('scale').dispatchEvent(
          new CustomEvent('scaleEvent', {
            detail: {
              target: parentEv.target,
              handlesValue,
              appData,
            },
          }),
        );
      } else {
        this.getNode('slider').dispatchEvent(
          new CustomEvent('sliderEvent', {
            detail: {
              target: parentEv.target,
              handlesPxValue,
              appData,
            },
          }),
        );
      }
    };

    this.getNode('slider').addEventListener('mousedown', initEvent);
    this.getNode('slider').addEventListener('touchstart', initEvent);
  }

  getNode(name: string): HTMLElement {
    return this.instances[name][0].getNode();
  }

  getNodes(name: string): HTMLElement[] {
    return this.instances[name].map((instance) => instance.getNode());
  }

  private getCoord(element: HTMLElement | string, coord: string): number {
    const defaultElement = typeof element === 'string' ? this.getNode(element) : element;
    return defaultElement.getBoundingClientRect()[coord as string];
  }

  private getCoords(element: HTMLElement | string, coord: string[]): Coords {
    const defaultElement = typeof element === 'string' ? this.getNode(element) : element;
    return coord.reduce(
      (result: Coords, name: string) => ({
        ...result,
        [name]: defaultElement.getBoundingClientRect()[name],
      }),
      {},
    );
  }

  private getSpecialCoord<R>(coord: string): R {
    const defaultSpeicalCoords = {
      handleSize: (): number => {
        return this.position === 'vertical'
          ? this.getNode('handle').getBoundingClientRect().height
          : this.getNode('handle').getBoundingClientRect().width;
      },

      limit: (): number => {
        return this.position === 'vertical'
          ? this.getNode('slider').getBoundingClientRect().height
          : this.getNode('slider').getBoundingClientRect().width;
      },

      handlesCoord: (): { [key: string]: number } => {
        const handles = this.getNodes('handle');
        const sliderTop = this.getCoord('slider', 'top');
        const coords =
          this.position === 'horizontal'
            ? handles.map((handle) => [handle.dataset.id, this.getCoord(handle, 'left')])
            : handles.map((handle) => [handle.dataset.id, Math.abs(sliderTop - this.getCoord(handle, 'top'))]);
        return Object.fromEntries(coords);
      },
    };
    if (defaultSpeicalCoords[coord]) return defaultSpeicalCoords[coord]();

    throw new Error(`${coord} was not found in defaultCoords or incorrect function`);
  }

  show(): void {
    this.anchor.style.display = '';
  }

  hide(): void {
    this.anchor.style.display = 'none';
  }

  destroy(): void {
    Array.from(this.anchor.children).forEach((node) => {
      node.remove();
    });
  }

  private getAppData(ev?: MouseEvent | TouchEvent) {
    const id = !ev ? 0 : this.defineCloseHandle(this.getCursorPxValue(ev));
    const limit: number = this.getSpecialCoord('limit');
    const handleSize: number = this.getSpecialCoord('handleSize');
    return { id, limit, handleSize };
  }

  private getHandlesPxValue(ev: MouseEvent | TouchEvent, id: number): number[] {
    const cursorPxValue = this.getCursorPxValue(ev);
    const handlesPxValue = this.getNodes('handle').map((handle) => {
      return this.position === 'horizontal'
        ? this.getCoord(handle, 'left') - this.getCoord('slider', 'left')
        : Math.abs(this.getCoord('slider', 'top') - this.getCoord(handle, 'top'));
    });

    // меняем value по id у того handle, который должен переместиться
    handlesPxValue.splice(id, 1, cursorPxValue);
    return handlesPxValue;
  }

  private getCursorPxValue(e: MouseEvent | TouchEvent): number {
    const sliderCoord = this.getCoords('slider', ['top', 'left']);
    const halfHandleSize = <number>this.getSpecialCoord('handleSize') / 2;
    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    return this.position === 'horizontal'
      ? clientX - sliderCoord.left - halfHandleSize
      : clientY - sliderCoord.top - halfHandleSize;
  }

  private defineCloseHandle(cursorPxValue: number): number {
    const handlesCoord: { [key: string]: number } = this.getSpecialCoord('handlesCoord');
    const handlesId = Object.keys(handlesCoord);
    const targetId = Object.values(handlesCoord).reduce(
      (current: (string | number)[], handleCoord, index) => {
        return Math.abs(cursorPxValue - handleCoord) < current[1]
          ? [handlesId[index], Math.abs(cursorPxValue + HALF_HANDLE_SIZE - handleCoord)]
          : current;
      },
      [0, Number.MAX_SAFE_INTEGER],
    )[0];

    return Number(targetId);
  }

  private createComponents(state: State) {
    return this.FactorySelector.getFactory().createComponents(this.anchor, state, {
      parentGetAppData: this.getAppData.bind(this),
      parentGetHandlesPxValues: this.getHandlesPxValue.bind(this),
    });
  }

  private isEmpty<T extends HTMLElement>(elem: T) {
    return elem.children.length === 0;
  }

  getComponent(name: string): Component {
    if (this.instances[name]) {
      return this.instances[name][0];
    }
    throw new Error('error');
  }
}

export default App;
