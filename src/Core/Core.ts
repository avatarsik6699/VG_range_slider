import { MinMax, RenderData, State, ValuePxValue } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { defaultCoreState } from "./defaultCoreState";

export class Core extends Observer {
  private state: State = defaultCoreState;
  constructor() {
    super();
  }

  setState(settings: State) {
    if (!settings) this._throwException('Не переданы настройки для обновления состояния')

    const {max, min}: MinMax = this._calcCorrectMinMax(settings.max, settings.min);
    const correctStep: number = this._calcCorrectStep(settings.step, max);
    const correctValue = this._calcCorrectValue(settings.value, max, min);

    this.state = {...defaultCoreState, ...settings, max, min, ...{step: correctStep, value: correctValue}};
    this.notify('updateState', this.state);
  }

  getState(): State {
    return this.state;
  }

  getRenderData(appData): void {
    if (!appData) this._throwException('Не переданы данные об приложении, нужные для проведения рассчетов');
    const values = this._getUnifyValue(appData)
    const distance = this._getDistance(); 
    const ratio = this._getRatio(appData.limit, appData.handleSize, distance);
    const scaleValues = this._calcScaleValues(ratio, distance);
    
    const valuePxValue: {[key: string]: ValuePxValue} = Object.fromEntries(values.map( (value, id) => {
      let pxValue = Math.round(this._calcPxValue(value, ratio))
      return [id, {pxValue, value}]
    }))
    
    const renderData: RenderData = {
      scaleValues,
      handleSize: appData.handleSize, 
      ...{id: appData.id, type: this.state.type, position: this.state.position},
      ...valuePxValue
    }
  
    this.notify('getRenderData', renderData);
  }

  private _getRatio(limit: number, handleSize: number, distance: number): number {
    return (limit - handleSize) / (distance / this.state.step);
  }

  private _getDistance(): number {
    return this.state.max - this.state.min;
  }

  private _getUnifyValue(appData): number[] {
    const distance: number = this.state.max - this.state.min; 
    const ratio: number = (appData.limit - appData.handleSize) / (distance / this.state.step);
    
    // унифицируем данные (переводим px в value, либо берем value из state, если init)
    if (appData.pxValue) {
      const values: number[] = [];
      appData.pxValue.forEach( px => {
      let value = this._calcCorrectValue(
        Math.round(px / ratio) * this.state.step + this.state.min, 
        this.state.max,
        this.state.min)
      values.push(...value);    
      })
    
      return values;
    } else if (appData.value) {
      return this._calcCorrectValue(
        appData.value,
        this.state.max,
        this.state.min
      )
    } else {
      return this._calcCorrectValue(
        this.state.value,
        this.state.max,
        this.state.min
      )
    }
  }

  private _calcCorrectValue(value: State['value'] | number, max: State['max'], min: State['min']): number[] {
    // переводим value -> [value] для правильной работы метода getRenderData
    const preValue: number[] = Array.isArray(value) 
    ? value
    : [value]
    
    // корректируем value, чтобы не выходил за пределы max и min
    return preValue.map( number => {
      if (number >= max) {
        return max;
      } else if (number <= min) {
        return min;
      } else {
        return number;
      }
    })
  }

  private _calcCorrectMinMax(max: State['max'], min: State['min']): MinMax {
    let correctMax: number;
    let correctMin: number;
    
    if (max < min) {
      correctMax = min;
      correctMin = max;
      return {max: correctMax, min: correctMin};
    } else if (max === min) {
      correctMax = max;
      correctMin = min - 1;
      return {max: correctMax, min: correctMin};
    } else {
      return {max, min}
    }
  }

  private _calcCorrectStep(step: State['step'], max: State['max']): number {
    if (step >= max) {
      return 1;
    } else if (step <= 0) {
      return 1;
    } else {
      return step;
    }
  }

  private _calcPxValue(value: number, ratio: number): number {
      return (value - this.state.min) / this.state.step * ratio;
  }

  private _calcScaleValues(ratio: number, distance: number): any {
    const min = this.state.min;
    const max = this.state.max;
    const step = this.state.step;
    const steps = new Set([min, max])
    const offset = min - Math.round(min / step) * step;
    
    for (let i = min; i <= max; i += distance * 0.2) {
      let value = Math.round(i / step) * step + offset;
      
      if (value >= max) {
        steps.add(max);
      } else if (value <= min) {
        steps.add(min);
      } else {
        steps.add(value);
      }
    }

    return Array.from(steps)
    .sort( (a,b) => a-b )
    .map( value => ({pxValue: this._calcPxValue(value, ratio), value}) )
  }

  private _throwException(message: string): never {
    throw new Error(message);
  }
}