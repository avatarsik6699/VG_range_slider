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
    let calculatedPxValue = (<number[]>staticData.handleValue).map( (num, index) => {
      let correctValue = Math.round(num / ratio / this.state.step) * this.state.step;
      let partOfDistance = correctValue / distance;
      let correctPxValue = partOfDistance * appData.slider['width'];
      let toolTipValue = correctValue + this.state.min;
      let id = appData.id ? appData.id : index;
      return [id, {correctPxValue, toolTipValue}]
    })
    
    let renderData = {
      ...{id: appData.id},
      ...scaleValues, 
      ...Object.fromEntries(calculatedPxValue), 
      ...{type: this.state.type}}
    this.notify('getRenderData', renderData);
  }

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
    const distance = max - min;

    let pieces = distance / step;
    const result = new Set([min, max])
    console.log(pieces)
    let steps = [];
    let spacing = [];
    return {steps, spacing};
  }
}