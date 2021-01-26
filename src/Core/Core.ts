import { SLIDER_CREATED, SLIDER_RECREATED } from '../App/App';
import { EVENT_TRIGGERED, EVENT_TRIGGERED_SCALE, RECRATE_APP } from '../Helpers/Constants';
import { AppData, MinMax, RenderData, ScaleValues, SettingsState, State } from '../Helpers/Interfaces';
import Observer from '../Helpers/Observer';
import defaultState from './defaultState';
import Validator from './Validator';

class Core extends Observer {
  private state: State = defaultState;
  private validator = new Validator();

  constructor(settings: State) {
    super();
    this.setState(settings);
  }

  setState(newState: State): void {
    const preparedState = { ...this.state, ...newState };
    const { max, min } = this.validator.validate('range', [preparedState.max, preparedState.min]);
    const step = this.validator.validate('step', [preparedState.step, max]);
    const value = this.validator.validate('value', [preparedState.value, max, min]);
    this.state = { ...preparedState, max, min, step, value };
  }

  getState(): State {
    return this.state;
  }

  actionHandler(data: SettingsState | AppData): void {
    console.log(data);
    switch (data.action) {
      case SLIDER_RECREATED:
        this.setState({ ...(data as SettingsState) });
        this.notify('recrateApp', this.state);
        break;
      case SLIDER_CREATED:
        console.log(1);
        this.notify('getRenderData', this.getRenderData(data));
        break;
      case EVENT_TRIGGERED_SCALE: {
        const { value } = data;
        this.setState({ ...this.state, value });
        this.notify('getRenderData', this.getRenderData(data));
        break;
      }
      case EVENT_TRIGGERED: {
        const value = this.getValueFromPxValue(data as AppData);
        this.setState({ ...this.state, value });
        this.notify('getRenderData', { ...this.getRenderData(data), eventType: data.eventType });
      }
    }
  }

  getRenderData(appData: AppData): RenderData {
    if (!appData) this.throwException('Не переданы данные об приложении, нужные для проведения рассчетов');

    const values = this.state.value;
    const distance = this.getDistance(this.state.min, this.state.max);
    const ratio = this.getRatio(appData.limit, appData.handleSize, distance);
    const scaleValues = this.calcScaleValues(ratio, distance);
    const handleCoords = values.map((value, id) => {
      return [
        id,
        {
          valuePxValue: { px: this.getPxValueFromValue(value, ratio), value },
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

  private getRatio(limit: number, handleSize: number, distance: number): number {
    return (limit - handleSize) / (distance / this.state.step);
  }

  private getDistance(min: number, max: number): number {
    return max - min;
  }

  private getValueFromPxValue(appData: AppData): number[] {
    const distance: number = this.getDistance(this.state.min, this.state.max);
    const ratio = this.getRatio(appData.limit, appData.handleSize, distance);
    return appData.pxValue!.reduce((acc: number[], px) => {
      const valueFromPxValue = Math.round(px / ratio) * this.state.step + this.state.min;
      return [...acc, valueFromPxValue];
    }, []);
  }

  private getPxValueFromValue(value: number, ratio: number): number {
    return ((value - this.state.min) / this.state.step) * ratio;
  }

  private calcScaleValues(ratio: number, distance: number): ScaleValues {
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
    return arr.map((value) => ({ px: this.getPxValueFromValue(value, ratio), value }));
  }

  private throwException(message: string): never {
    throw new Error(message);
  }
}

export default Core;
