import { Scale } from '../App/components/Scale/Scale';
import { AppData, MinMax, RenderData, ScaleValues, State, ValuePxValue } from '../Helpers/Interfaces';
import Observer from '../Helpers/Observer';
import { defaultState } from './defaultState';

export class Core extends Observer {
  private state: State = defaultState;

  constructor(settings: State) {
    super();
    this.setState(settings);
  }

  setState(settings) {
    const defaultSettings = { ...this.state, ...settings };
    const { max, min }: MinMax = this._calcCorrectMinMax(defaultSettings.max, defaultSettings.min);
    const step: number = this._calcCorrectStep(defaultSettings.step, max);
    const value = !settings.action
      ? this._calcCorrectValue(defaultSettings.value, max, min)
      : this._getUnifyValue(settings, defaultSettings);

    switch (defaultSettings.action) {
      case 'SLIDER_IS_CREATED':
        this.state = { ...this.state, value };
        this.notify('getRenderData', this.getRenderData(settings));
        break;
      case 'EVENT_TRIGGERED':
        this.state = { ...this.state, value };
        this.notify('getRenderData', this.getRenderData(settings));
        break;
      case 'RECRATE_APP':
        this.state = { ...defaultSettings, max, min, step, value };
        this.notify('updateState', this.state);
        break;
      default:
        this.state = { ...defaultSettings, max, min, step, value };
    }
  }

  getState(): State {
    return this.state;
  }

  getRenderData(appData: AppData): void {
    if (!appData) this._throwException('Не переданы данные об приложении, нужные для проведения рассчетов');
    const { value } = this.state;
    const distance = this._getDistance(this.state.min, this.state.max);
    const ratio = this._getRatio(appData.limit, appData.handleSize, distance);
    const scaleValues = this._calcScaleValues(ratio, distance);
    const valuePxValue = value.map((value, id) => [
      id,
      { pxValue: Math.round(this._calcPxValue(value, ratio)), value },
    ]);

    return {
      scaleValues,
      handleSize: appData.handleSize,
      id: appData.id,
      type: this.state.type,
      position: this.state.position,
      ...Object.fromEntries(valuePxValue),
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
    return arr.map((value) => ({ pxValue: this._calcPxValue(value, ratio), value }));
  }

  private _throwException(message: string): never {
    throw new Error(message);
  }
}
