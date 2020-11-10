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
    
    if (this.state.type === 'range' && !appData.targetId) {
      let renderData = value.map( (num, index) => {
        let handlePxValue = appData.hasOwnProperty('left')
        ? appData.left[index]
        : (num / this.state.max) * appData.slider['width']; 
        
        let correctPxValue = Math.round(handlePxValue / ratio / this.state.step) * this.state.step;
        let tipValue = correctPxValue / ratio + this.state.min;
        return [index, {correctPxValue, tipValue}];
      })
      console.log( {...Object.fromEntries(renderData), ...this.state})
      this.notify('getRenderData', {...Object.fromEntries(renderData), ...this.state})
    } else {
      
      let handlePxValue = appData.left;
      let correctPxValue = Math.round(handlePxValue / ratio / this.state.step) * this.state.step;
      let tipValue = correctPxValue / ratio + this.state.min;
      let renderData =  {[appData.targetId] : {correctPxValue, tipValue}};
      console.log(renderData)
      this.notify('getRenderData', {...renderData, ...this.state});
    }
  }



  calcCorrectValue() {
    const remainder = this.state.value % this.state.step;
    if (remainder !== 0) { return this.state.value - remainder }
    else { return this.state.value };
  }
}