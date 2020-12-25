import { SLIDER_IS_CREATED } from '../Helpers/Constants';
import { Component, RenderData, State } from '../Helpers/Interfaces';
import Observer from '../Helpers/Observer';
import FactorySelector from './FactorySelector';

const HALF_HANDLE_SIZE = 10;
type Result = { [key: string]: number };

class App extends Observer {
  private instances: { [key: string]: Component[] } = {};

  private position = 'horizontal';

  constructor(private anchor: HTMLElement, private FactorySelector: FactorySelector) {
    super();
  }

  create(state: State): void {
    this.instances = this._createComponents(state);
    this.position = state.position;
    // после начальной отрисовки данные об сладйере отправляются в core
    this.notify('finishCreate', { ...this._getAppData(), action: SLIDER_IS_CREATED });
  }

  reCreate(params: State): void {
    if (!this._isEmpty(this.anchor)) {
      this.destroy();
    }
    this.create(params);
  }

  renderUI(renderData: RenderData): void {
    Object.values(this.instances).forEach((instance) => {
      instance.forEach((subInstance) => (subInstance.render ? subInstance.render(renderData) : ''));
    });
  }

  bindEvents(): void {
    const initEvent = (parentEv: MouseEvent | TouchEvent): void => {
      const handlesValue = this.getNodes('handle').map((handle) => Number(handle.dataset.value));
      const appData = this._getAppData(parentEv);
      const handlesPxValue = this._getHandlesPxValues(parentEv, appData.id);
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
    if (!this.instances) this._throwException('First you need to get component instances');
    return this.instances[name][0].getNode();
  }

  getNodes(name: string): HTMLElement[] {
    if (!this.instances) this._throwException('First you need to get component instances');
    return this.instances[name].map((instance) => instance.getNode());
  }

  getCoord(elemName: string | HTMLElement, coord: string | string[]): Result | number {
    const elem = typeof elemName === 'string' ? this.getNode(elemName) : elemName;
    if (typeof coord === 'string') return elem.getBoundingClientRect()[coord];
    if (Array.isArray(coord)) {
      return coord.reduce(
        (result: Result, coordName: string) => ({ ...result, [coordName]: elem.getBoundingClientRect()[coordName] }),
        {},
      );
    }

    return this._throwException('incorrect coord or elemName');
  }

  getSpecialCoord(coord: string | (() => number)): number | number[] {
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

      handlesCoord: (): number[][] => {
        const handles = this.getNodes('handle');
        const sliderTop = this.getCoord('slider', 'top');
        const result =
          this.position === 'horizontal'
            ? handles.map((handle) => [handle.dataset.id, this.getCoord(handle, 'left')])
            : handles.map((handle) => [handle.dataset.id, Math.abs(sliderTop - this.getCoord(handle, 'top'))]);
        return Object.fromEntries(result);
      },
    };
    if (typeof coord === 'string' && defaultSpeicalCoords[coord]) {
      return defaultSpeicalCoords[coord]();
    }
    if (typeof coord === 'function') {
      return coord();
    }
    return this._throwException(`${coord} was not found in defaultCoords or incorrect function`);
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

  private _getAppData(e?: MouseEvent | TouchEvent) {
    const id = !e ? 0 : this._defineCloseHandle(this._getCursorPxValue(e));
    const limit = this.getSpecialCoord('limit');
    const handleSize = <number>this.getSpecialCoord('handleSize');
    return { id, limit, handleSize };
  }

  private _getHandlesPxValues(ev: MouseEvent | TouchEvent, id: number): number[] {
    const cursorPxValue = this._getCursorPxValue(ev);
    const handlesPxValue = this.getNodes('handle').map((handle) => {
      return this.position === 'horizontal'
        ? this.getCoord(handle, 'left') - this.getCoord('slider', 'left')
        : Math.abs(this.getCoord('slider', 'top') - this.getCoord(handle, 'top'));
    });

    // меняем value по id у того handle, который должен переместиться
    handlesPxValue.splice(id, 1, cursorPxValue);
    return handlesPxValue;
  }

  private _getCursorPxValue(e: MouseEvent | TouchEvent): number {
    const sliderCoord = this.getCoord('slider', ['top', 'left']);
    const halfHandleSize = <number>this.getSpecialCoord('handleSize') / 2;
    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    return this.position === 'horizontal'
      ? clientX - sliderCoord.left - halfHandleSize
      : clientY - sliderCoord.top - halfHandleSize;
  }

  private _defineCloseHandle(cursorPxValue: number): number {
    const handlesCoord = this.getSpecialCoord('handlesCoord') as number[];
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

  private _createComponents(state: State) {
    return this.FactorySelector.getFactory().createComponents(this.anchor, state, {
      getAppData: this._getAppData.bind(this),
      getHandlesPxValues: this._getHandlesPxValues.bind(this),
    });
  }

  private _isEmpty<T extends HTMLElement>(elem: T) {
    return elem.children.length === 0;
  }

  private _throwException(message: string): never {
    throw new Error(message);
  }

  getComponent(name: string): Component {
    if (this.instances[name] === undefined) throw new Error("Component wasn't found");
    return this.instances[name][0];
  }
}

export default App;
