import { EVENT_TRIGGERED, RECRATE_APP, SLIDER_IS_CREATED } from '../Helpers/Constants';
import { Component, RenderData, State } from '../Helpers/Interfaces';
import Observer from '../Helpers/Observer';

class App extends Observer {
  private instances: { [key: string]: Component[] } = {};

  private position = 'horizontal';

  private flag = true;

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
    const initEvent = (e: MouseEvent | TouchEvent): void => {
      const target = <HTMLElement>e.target;
      const eventName = this._getEventName(target);
      if (!eventName) return;
      this[eventName](e);
    };

    this.anchor.addEventListener('mousedown', initEvent);
    this.anchor.addEventListener('touchstart', initEvent);
  }

  getNode(name: string): HTMLElement {
    if (!this.instances) this._throwException('First you need to get component instances');
    return this.instances[name][0].getNode();
  }

  getNodes(name: string): HTMLElement[] {
    if (!this.instances) this._throwException('First you need to get component instances');

    return this.instances[name].map((instance) => instance.getNode());
  }

  getCoord(elemName: string | HTMLElement, coord: string | string[]) {
    const elem = typeof elemName === 'string' ? <HTMLElement>this.getNode(elemName) : elemName;

    if (typeof coord === 'string') {
      return elem.getBoundingClientRect()[coord];
    }
    if (Array.isArray(coord)) {
      const coords = {};
      coord.forEach((coordName) => {
        coords[coordName] = elem.getBoundingClientRect()[coordName];
      });
      return coords;
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
    this._throwException(`${coord} was not found in defaultCoords or incorrect function`);
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

  private _settingsEvent(e) {
    const { target } = e;
    const settings = this.getNode('settings') as HTMLFormElement;
    if (!settings) throw new Error('Settings not found');

    const settingsData: any = {};
    const getSettingsData = (e: Event) => {
      Array.from(settings.elements).forEach((el) => {
        const { value } = <HTMLInputElement | HTMLSelectElement>el;
        const { name } = <HTMLInputElement | HTMLSelectElement>el;
        settingsData[name] = isNaN(<number>value) ? value : Number(value);
      });

      const values = settingsData.type === 'single' ? ['from'] : ['from', 'to'];

      settingsData.value = values.map((field) => {
        const valueNum = settingsData[field];
        delete settingsData[field];
        return valueNum;
      });

      this.flag = true;
      target.removeEventListener('blur', getSettingsData);
      this.notify('settingsEvent', { ...settingsData, action: RECRATE_APP });
    };

    if (target.nodeName === 'INPUT' || target.nodeName === 'SELECT') {
      if (this.flag) {
        this.flag = false;
        target.addEventListener('blur', getSettingsData, { once: true });
      } else {
      }
    }
  }

  private _sliderEvent(e: MouseEvent | TouchEvent) {
    const target = e.target as HTMLElement;
    const appData = this._getAppData(e);
    if (target.closest(`[data-component="scale"]`)) {
      this._scaleEvent(e);
    } else if (target.dataset.component !== 'handle') {
      const appData = this._getAppData(e);
      const handlesPxValues = this._getHandlesPxValues(e, appData.id);
      this.notify('touchEvent', {
        action: EVENT_TRIGGERED,
        eventType: 'touch',
        pxValue: handlesPxValues,
        ...appData,
      });
    } else {
      const handleMove = (e: MouseEvent | TouchEvent): void => {
        const handlesPxValues = this._getHandlesPxValues(e, appData.id);
        this.notify('moveEvent', { action: EVENT_TRIGGERED, pxValue: handlesPxValues, ...appData });
      };

      const finishMove = (): void => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', finishMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', finishMove);
      };

      if (e instanceof TouchEvent) {
        e.preventDefault();
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', finishMove);
      } else {
        e.preventDefault();
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', finishMove);
      }

      this.getNodes('handle').forEach((handle) => {
        handle.ondragstart = () => false;
      });
    }
  }

  private _scaleEvent(e: MouseEvent | TouchEvent) {
    const appData = this._getAppData(e);
    const scaleValue = Number((e.target as HTMLElement)?.textContent);
    const handlesValue = this.getNodes('handle').map((handle) => Number(handle.dataset.value));

    // меняем value по id у того handle, который должен переместиться
    handlesValue.splice(appData.id, 1, scaleValue);

    this.notify('scaleEvent', { action: EVENT_TRIGGERED, eventType: 'touch', value: handlesValue, ...appData });
  }

  private _getAppData(e?: MouseEvent | TouchEvent) {
    const id = !e ? 0 : this._defineCloseHandle(this._getCursorPxValue(e));
    const limit = this.getSpecialCoord('limit');
    const handleSize = <number>this.getSpecialCoord('handleSize');
    return { id, limit, handleSize };
  }

  private _getHandlesPxValues(e: MouseEvent | TouchEvent, id: number): number[] {
    const handles = this.getNodes('handle');
    const cursorPxValue = this._getCursorPxValue(e);
    const handlesPxValue = handles.map((handle) => {
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

  private _defineCloseHandle(pxValue: number): number {
    const handlesCoord = this.getSpecialCoord('handlesCoord') as number[];
    const handlesId = Object.keys(handlesCoord);
    const relativeCoords = Object.values(handlesCoord).reduce(
      (current, handleCoord, index) => {
        return Math.abs(pxValue - handleCoord) < current[1]
          ? [handlesId[index], Math.abs(pxValue + 10 - handleCoord)]
          : current;
      },
      [0, Number.MAX_SAFE_INTEGER],
    );

    return Number(relativeCoords[0]);
  }

  private _getEventName(target: HTMLElement): string {
    if (!target) this._throwException('Не передан target');

    const eventName = ['slider', 'settings'].find((name) => {
      if (target.closest(`[data-component="${name}"]`)) {
        return name;
      }
    });

    return eventName === undefined ? '' : `_${eventName}Event`;
  }

  private _createComponents(params: State) {
    return this.FactorySelector.getFactory().createComponents(this.anchor, params);
  }

  private _isEmpty<T extends HTMLElement>(elem: T) {
    return elem.children.length === 0;
  }

  private _throwException(message: string): never {
    throw new Error(message);
  }
}

export default App;
