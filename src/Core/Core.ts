import { MinMax, State } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { defaultCoreState } from "./defaultCoreState";

export class Core extends Observer {
  private state: State = defaultCoreState;
  private init: boolean = true; //костыль?
  private appData: any; // костыль?
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
    const staticData = this.getStaticData(appData)
    const scaleValues = this.getScaleValues(appData);
    const distance = <number>staticData.distance;
    const ratio = <number>staticData.ratio;
    let calculatedPxValue = (<number[]>staticData.value).map( (value, index) => {
      // если бы в ratio я не делил на step, то было бы value - min * ratio
      let correctPxValue = (value - this.state.min) * (ratio / this.state.step)
      let id = appData.id ? appData.id : index;
      return [id, {correctPxValue, value}]
    })
    
    let renderData = {
      ...{id: appData.id},
      ...scaleValues, 
      ...Object.fromEntries(calculatedPxValue), 
      ...{type: this.state.type},
      ...{position: this.state.position}
    }

    this.notify('getRenderData', renderData);
  }

  private getStaticData(appData): {[key: string]: number | number[]} {
    const state = this.state;
    const sliderWidth = appData.slider['width'];
    const sliderHeight = appData.slider['height'];
    const handleWidth = appData.handles['width'][0] ?? appData.handles['width'];
    const handleHeight = appData.handles['height'][0] ?? appData.handles['height'];

    const distance: number = state.max - state.min; // дистанция
    const ratio: number = state.position === 'horizontal' 
    ? (sliderWidth - handleWidth) / (distance / state.step) // соотношеие px к единцие value
    : (sliderHeight - handleHeight) / (distance / state.step)
    
    // если init -> переводм нативный value в px иначе init -> cursorPosition
    let value = !appData.pxValue
    ? state.value.map( value => Math.round((value - state.min) * ratio) )
    : [Math.round(appData.pxValue / ratio) * state.step + state.min] 

    // if (handleValue.length > 1) { handleValue = handleValue.sort( (a,b) => a - b) }
   
    return {value, distance, ratio};
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

  private getScaleValues(appData): any {
    const min = this.state.min;
    const max = this.state.max;
    const step = this.state.step;
    const distance = max - min;
    let handleWidth =  appData.handles['width'].length >= 2 
    ? appData.handles['width'][0]
    : appData.handles['width']

    let handleHeight = appData.handles['height'].length >= 2
    ? appData.handles['height'][0]
    : appData.handles['height']
    let staticData = this.getStaticData(appData);
    const ratio = this.state.position === 'horizontal'
    ? (appData.slider['width'] - handleWidth) / (distance / this.state.step)
    : (appData.slider['height'] - handleHeight) / (distance / this.state.step);

    // let pieces = distance / step;
    const preResult = new Set([min, max])
    const offset = min - Math.round(min / step) * step;
    let spacing: number[] = [];
     for (let i = min; i <= max; i += distance * 0.2) {
       let value = Math.round(i / step) * step + offset;
       if (value >= max) {
        preResult.add(max);
       } else if (value <= min) {
        preResult.add(min);
       } else {
        preResult.add(value);
       }
    }
    
    let result =  Array.from(preResult).sort( (a,b) => a -b).map( value => ({value, pxValue: this.calcPxValue(ratio, value)}))
    return {result};
  }

  calcPxValue(ratio, value): number {
    return (value - this.state.min) * (ratio/ this.state.step);
  }
}