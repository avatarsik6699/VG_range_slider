import { MinMax, State } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { defaultCoreState } from "./defaultCoreState";

export class Core extends Observer {
  private state: State = defaultCoreState;
  constructor() {
    super();
  }

  setState(settings: State) {
    const {max, min}: MinMax = this.calcCorrectMinMax(settings.max, settings.min);
    const correctStep: number = this.calcCorrectStep(settings.step, max, min);
    const correctValue = this.calcCorrectValue(settings.value, max, min);
    this.state = {...defaultCoreState, ...settings, max, min, ...{step: correctStep, value: correctValue}};
    this.notify('updateState', this.state);
  }

  getState(): State {
    return this.state;
  }

  getRenderData(appData): void {
    // if (!appData) throw new Error('Не переданы данные об приложении, нужные для проведения рассчетов');
    
    const values = this.getUnifyValue(appData)
    const distance: number = this.state.max - this.state.min; 
    const ratio: number = (appData.limit - appData.handleSize) / (distance / this.state.step);
    const scaleValues = this.calcScaleValues(ratio, distance);

    const correctPxValueAndValue = (<number[]>values).map( (value, index) => {
      let PxValue = this.calcPxValue(value, ratio)
      let id = appData.id ? appData.id : index;
      return [id, {PxValue, value}]
    })
    
    const renderData = {
      ...{id: appData.id, type: this.state.type, position: this.state.position},
      ...scaleValues, 
      ...Object.fromEntries(correctPxValueAndValue)
    }

    this.notify('getRenderData', renderData);
  }

  private getUnifyValue(appData): number[] {
    const distance: number = this.state.max - this.state.min; 
    const ratio: number = (appData.limit - appData.handleSize) / (distance / this.state.step);

    // унифицируем данные (переводим px в value, либо берем value из state, если init)
    return !appData.pxValue
    ? this.state.value
    : [Math.round(appData.pxValue / ratio) * this.state.step + this.state.min] 
    // [Math.round(appData.pxValue / ratio) * state.step + state.min] предыдущее px -> value
    // this.state.value.map( value => Math.round((value - this.state.min) * ratio) ) предыдущий value
    // if (handleValue.length > 1) { handleValue = handleValue.sort( (a,b) => a - b) }
  }

  private calcCorrectValue(value: State['value'], max: State['max'], min: State['min']): number[] {
    // переводим value -> [value]
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

  private calcCorrectMinMax(max: State['max'], min: State['min']): MinMax {
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

  private calcCorrectStep(step: State['step'], max: State['max'], min: State['min']): number {
    if (step >= max) {
      return 1;
    } else if (step <= 0) {
      return 1;
    } else {
      return step;
    }
  }

  private calcPxValue(value: number, ratio: number): number {
      return (value - this.state.min) / this.state.step * ratio;
  }

  private calcScaleValues(ratio: number, distance: number): any {
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

    let result = Array.from(steps).sort( (a,b) => a-b).map( value => ({value, pxValue: this.calcPxValue(value, ratio)}))
    return {result}
  }
}