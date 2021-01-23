import { AppData, MinMax, RenderData, ScaleValues, State } from '../Helpers/Interfaces';
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

  // setState(newState: State, settings?: { value: number[]; action?: string }): void {
  //   const preparedState = { ...this.state, ...newState };
  //   const { max, min }: MinMax = this.calcCorrectMinMax(preparedState.max, preparedState.min);
  //   const step: number = this.calcCorrectStep(preparedState.step, max);
  //   const value = settings?.value ?? this.calcCorrectValue(preparedState.value, max, min);

  //   this.state = { ...preparedState, max, min, step, value };
  //   if (settings?.action === 'RECRATE_APP') {
  //     this.notify('recrateApp', this.state);
  //   }
  // }

  setState(newState: State): void {
    const preparedState = { ...this.state, ...newState };
    const { max, min } = this.validator.validate('range', [preparedState.max, preparedState.min]);
    const step = this.validator.validate('step', [preparedState.step, max]);
    const value = this.validator.validate('value', [preparedState.value, max, min]);

    this.state = { ...preparedState, max, min, step, value };
    // if (settings?.action === 'RECRATE_APP') {
    //   this.notify('recrateApp', this.state);
    // }
  }

  getState(): State {
    return this.state;
  }

  appDataHandler(appData: AppData): void {
    const value = this.getUnifyValue(appData, this.state);
    this.setState(this.state, { value });
    const { eventType } = appData;
    switch (appData.action) {
      case 'SLIDER_IS_CREATED':
        this.notify('getRenderData', this.getRenderData(appData));
        break;
      case 'EVENT_TRIGGERED':
        this.notify('getRenderData', { ...this.getRenderData(appData), eventType });
        break;
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
          valuePxValue: { px: Math.round(this.calcPxValue(value, ratio)), value },
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

  private getUnifyValue(appData: AppData, state: State): number[] {
    const distance: number = this.getDistance(state.min, state.max);

    // унифицируем данные (переводим px в value, либо берем value из state
    // если не был передан action и, как следствие, pxValue/value)
    if (appData.pxValue) {
      const ratio = this.getRatio(appData.limit, appData.handleSize, distance);
      return appData.pxValue.reduce((values: number[], px) => {
        const valueFromPxValue = Math.round(px / ratio) * state.step + state.min;
        const value = this.calcCorrectValue(valueFromPxValue, state.max, state.min);
        return [...values, ...value];
      }, []);
    }
    if (appData.value) {
      return this.calcCorrectValue(appData.value, state.max, state.min);
    }
    return this.calcCorrectValue(state.value, state.max, state.min);
  }

  private calcCorrectValue(value: number[] | number, max: number, min: number): number[] {
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

  // private calcCorrectMinMax(max: number, min: number): MinMax {
  //   let correctMax: number;
  //   let correctMin: number;

  //   if (max < min) {
  //     correctMax = min;
  //     correctMin = max;
  //     return { max: correctMax, min: correctMin };
  //   }
  //   if (max === min) {
  //     correctMax = max;
  //     correctMin = min - 1;
  //     return { max: correctMax, min: correctMin };
  //   }
  //   return { max, min };
  // }

  // private calcCorrectStep(step: number, max: number): number {
  //   if (step >= max) {
  //     return 1;
  //   }
  //   if (step <= 0) {
  //     return 1;
  //   }
  //   return step;
  // }

  private calcPxValue(value: number, ratio: number): number {
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
    return arr.map((value) => ({ px: this.calcPxValue(value, ratio), value }));
  }

  private throwException(message: string): never {
    throw new Error(message);
  }
}

export default Core;
