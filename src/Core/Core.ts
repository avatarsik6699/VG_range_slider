import { emit } from "process";
import { Observer } from "../Helpers/Observer";
import { defaultCoreState } from "./defaultCoreState";

export class Core extends Observer {
  private state: any = defaultCoreState;
  private init: boolean = true;
  constructor(private options: {}) {
    super();
    this.setState()
  }

  setState() {
    this.state = {...defaultCoreState, ...this.options};
  }

  getState() {
    return this.state;
  }

  getRenderData(appData): void {
    const staticData = this.getStaticData(appData)
    const scaleValues = this.getScaleValues(appData);

    const distance = <number>staticData.distance;
    const ratio = <number>staticData.ratio;
    let calculatedPxValue = (<number[]>staticData.handleValue).map( (num, id) => {
      let correctValue = Math.round(num / ratio / this.state.step) * this.state.step;
      let partOfDistance = correctValue / distance;
      let correctPxValue = partOfDistance * appData.slider['width'];
      let toolTipValue = correctValue + this.state.min;
      return [id, {correctPxValue, toolTipValue}]
    })
    
    let renderData = {...scaleValues, ...Object.fromEntries(calculatedPxValue), ...this.state};
    this.notify('getRenderData', renderData);
  }
  //   if (this.state.type === 'range' && !appData.targetId) {
  //     let renderData = value.map( (num, index) => {
  //       // let handlePxValue = appData.hasOwnProperty('left')
  //       // ? appData.left[index]
  //       // : (num / this.state.max) * appData.slider['width']; 
        
  //       let correctPxValue = Math.round(handlePxValue / ratio / this.state.step) * this.state.step;
  //       let tipValue = correctPxValue / ratio + this.state.min;
  //       return [index, {correctPxValue, tipValue}];
  //     })
  //     this.notify('getRenderData', {scaleValues, ...Object.fromEntries(renderData), ...this.state})
  //   } else {
  //     let handlePxValue = appData.left;
  //     let correctValue = Math.round(handlePxValue / ratio / this.state.step) * this.state.step;
  //     let partOfDistance = correctValue / distance;
  //     let correctPxValue = partOfDistance * appData.slider['width'];
  //     let renderData =  {0 : {correctPxValue, correctValue}};
  //     this.notify('getRenderData', {scaleValues, ...renderData, ...this.state});
  //   }
  // }

  private getStaticData(appData): {[key: string]: number | number[]} {
    const distance: number = this.state.max - this.state.min; // дистанция
    const ratio: number = appData.slider['width'] / distance; // соотношеие px к единцие value
    const stateValue = this.calcCorrectValue();
    // если init -> переводм нативный value в px иначе init -> cursorPosition
    const handleValue = appData.pxValue === undefined
    ? stateValue.map( num => (num / this.state.max) * appData.slider['width'])
    : [appData.pxValue] 

    return {handleValue, distance, ratio};
  }

  private calcCorrectValue(): number[] {
    const preValue: number[] = Array.isArray(this.state.value) 
    ? this.state.value 
    : [this.state.value] // 1 -> [1]
    
    return this.state.value = preValue.map( num => {
      if (num >= this.state.max) {
        return this.state.max;
      }

      if (num <= this.state.min) {
        return this.state.min;
      }

      return num;
    })
  }

  private getScaleValues(appData): {spacing: number[], steps: number[]} {
    const min = this.state.min;
    const max = this.state.max;
    const step = this.state.step;
    const ratio = appData.slider['width'] / max;
    const spacing: number[] = [];
    const steps: number[] = [];
    for (let i = min; i <= max; i += Math.round(0.2 * max / step) * step) {
      steps.push(i);
      spacing.push(Math.round(i * ratio));
    }
    return {steps, spacing};
  }
}