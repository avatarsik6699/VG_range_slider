import { emit } from "process";
import { Observer } from "../Helpers/Observer";
import { defaultCoreState } from "./defaultCoreState";

export class Core extends Observer {
  private state: any = defaultCoreState;
  constructor(private options: {}) {
    super();
    this.setState()
  }

  setState() {
    this.state = {...defaultCoreState, ...this.options};
    let value = this.calcCorrectValue();
    const correctState = {};
  }

  getState() {
    return this.state;
  }

  getRenderData(appData): void {
    const distance = this.state.max - this.state.min; // дистанция
    const ratio = appData.slider['width'] / distance; // соотношеие px к единцие value
    const value: number[] = Array.isArray(this.state.value) ? this.state.value : [this.state.value];
    const scaleValues = this.calcScaleValues(appData); 

    if (this.state.type === 'range' && !appData.targetId) {
      let renderData = value.map( (num, index) => {
        let handlePxValue = appData.hasOwnProperty('left')
        ? appData.left[index]
        : (num / this.state.max) * appData.slider['width']; 
        
        let correctPxValue = Math.round(handlePxValue / ratio / this.state.step) * this.state.step;
        let tipValue = correctPxValue / ratio + this.state.min;
        return [index, {correctPxValue, tipValue}];
      })
      this.notify('getRenderData', {scaleValues, ...Object.fromEntries(renderData), ...this.state})
    } else {
      let handlePxValue = appData.left;
      let correctValue = Math.round(handlePxValue / ratio / this.state.step) * this.state.step;
      let partOfDistance = correctValue / distance;
      let correctPxValue = partOfDistance * appData.slider['width'];
      let renderData =  {0 : {correctPxValue, correctValue}};
      console.log({scaleValues, ...renderData, ...this.state})
      this.notify('getRenderData', {scaleValues, ...renderData, ...this.state});
    }
  }

  calcScaleValues(appData) {
    let min = this.state.min;
    let max = this.state.max;
    let step = this.state.step;
    let ratio = appData.slider['width'] / max;
    let steps: number[] = [];
    steps.push(0);
    for (let i = min; i <= max; i += step + (0.2 * max)) {
      steps.push(Math.round(i * ratio));
    }
    steps.push(appData.slider['width'])
    return steps;
  }

  calcCorrectValue(): number {
    const remainder = this.state.value % this.state.step;
    if (remainder !== 0) { return this.state.value - remainder }
    else { return this.state.value };
  }
}