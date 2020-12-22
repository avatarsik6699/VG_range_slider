import { AppData, MinMax, RenderData, ScaleValues, State } from '../Helpers/Interfaces';
import Observer from '../Helpers/Observer';
import defaultState from './defaultState';
//MapOfHandles
class Core extends Observer {
  private state: State = defaultState;

  constructor(settings: State) {
    super();
    this.setState(settings);
  }

  setState(settings: AppData | State): void {
    const prepareState = { ...this.state, ...settings };
    const { max, min }: MinMax = this._calcCorrectMinMax(prepareState.max, prepareState.min);
    const step: number = this._calcCorrectStep(prepareState.step, max);
    const { eventType } = <AppData>settings ?? null;
    const value = !settings.action
      ? this._calcCorrectValue(prepareState.value, max, min)
      : this._getUnifyValue(<AppData>settings, prepareState);

    switch ((prepareState as AppData).action) {
      case 'SLIDER_IS_CREATED':
        this.state = { ...this.state, value };
        this.notify('getRenderData', this.getRenderData(settings as AppData));
        break;
      case 'EVENT_TRIGGERED':
        this.state = { ...this.state, value };
        this.notify('getRenderData', { ...this.getRenderData(settings as AppData), eventType });
        break;
      case 'RECRATE_APP':
        this.state = { ...prepareState, max, min, step, value };
        this.notify('updateState', this.state);
        break;
      default:
        this.state = { ...prepareState, max, min, step, value };
    }
  }

  getState(): State {
    return this.state;
  }

  getRenderData(appData: AppData): RenderData {
    if (!appData) this._throwException('Не переданы данные об приложении, нужные для проведения рассчетов');

    const values = this.state.value;
    const distance = this._getDistance(this.state.min, this.state.max);
    const ratio = this._getRatio(appData.limit, appData.handleSize, distance);
    const scaleValues = this._calcScaleValues(ratio, distance);
    const handleCoords = values.map((value, id, arr) => {
      return [
        id,
        {
          valuePxValue: { px: Math.round(this._calcPxValue(value, ratio)), value },
          next: arr[id + 1] ?? null,
          prev: arr[id - 1] ?? null,
          notCorrectValue: this._calcPxValue(value, ratio),
        },
      ];
    });
    return {
      scaleValues,
      handleSize: appData.handleSize,
      targetId: Number(appData.id),
      type: this.state.type,
      position: this.state.position,
      coords: Object.fromEntries(handleCoords),
    };
  }

  private _getRatio(limit: number, handleSize: number, distance: number): number {
    return (limit - handleSize) / (distance / this.state.step);
  }

  private _getDistance(min: number, max: number): number {
    return max - min;
  }

  private _getUnifyValue(appData: AppData, state: State): number[] {
    const distance: number = this._getDistance(state.min, state.max);

    // унифицируем данные (переводим px в value, либо берем value из state
    // если не был передан action и, как следствие, pxValue/value)
    if (appData.pxValue) {
      const ratio = this._getRatio(appData.limit, appData.handleSize, distance);
      return appData.pxValue.reduce((values: number[], px) => {
        const valueFromPxValue = Math.round(px / ratio) * state.step + state.min;
        const value = this._calcCorrectValue(valueFromPxValue, state.max, state.min);
        return [...values, ...value];
      }, []);
    }
    if (appData.value) {
      return this._calcCorrectValue(appData.value, state.max, state.min);
    }
    return this._calcCorrectValue(state.value, state.max, state.min);
  }

  private _calcCorrectValue(value: number[] | number, max: number, min: number): number[] {
    // переводим value -> [value] для правильной работы метода getRenderData
    const preValue: number[] = Array.isArray(value) ? value : [value];

    // корректируем value, чтобы не выходил за пределы max и min
    return preValue
      .sort((a, b) => a - b)
      .map((number) => {
        if (number >= max) {
          return max;
        }
        if (number <= min) {
          return min;
        }
        return number;
      });
  }

  private _calcCorrectMinMax(max: number, min: number): MinMax {
    let correctMax: number;
    let correctMin: number;

    if (max < min) {
      correctMax = min;
      correctMin = max;
      return { max: correctMax, min: correctMin };
    }
    if (max === min) {
      correctMax = max;
      correctMin = min - 1;
      return { max: correctMax, min: correctMin };
    }
    return { max, min };
  }

  private _calcCorrectStep(step: number, max: number): number {
    if (step >= max) {
      return 1;
    }
    if (step <= 0) {
      return 1;
    }
    return step;
  }

  private _calcPxValue(value: number, ratio: number): number {
    return ((value - this.state.min) / this.state.step) * ratio;
  }

  private _calcScaleValues(ratio: number, distance: number): ScaleValues {
    const { min } = this.state;
    const { max } = this.state;
    const { step } = this.state;
    const steps = new Set([min, max]);
    const offset = min - Math.round(min / step) * step;
    const factor = 0.2;

    for (let i = min; i <= max; i += distance * factor) {
      const value = Math.round(i / step) * step + offset;
      if (value >= max) {
        steps.add(max);
      } else if (value <= min) {
        steps.add(min);
      } else {
        steps.add(value);
      }
    }

    const arr = Array.from(steps).sort((a, b) => a - b);
    const diff = (arr[1] - arr[0]) / 2;
    if (max - arr[arr.length - 2] < diff) {
      arr.splice(arr.length - 2, 1);
    }
    return arr.map((value) => ({ px: this._calcPxValue(value, ratio), value }));
  }

  private _throwException(message: string): never {
    throw new Error(message);
  }
}

export default Core;
