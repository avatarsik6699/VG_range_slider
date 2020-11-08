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

  getRenderData(viewData): void {
    let distance = this.state.max - this.state.min; // дистанция
    let ratio = viewData.Slider['width'] / distance; // соотношеие px к единцие value
    // если left (позиция курсора) не передана -> вычисляем её из value
    let cursorPosition = !viewData.left  
    ? (this.state.value / this.state.max) * viewData.Slider['width']
    : viewData.left
    // приравнивание 1px к 1value и уменьшение пути на step 
    let correctValue = Math.round(cursorPosition / ratio / this.state.step) * this.state.step;
    let partOfDistance = correctValue / distance; // часть дистанции от 0 до 1
    let pxValue = partOfDistance * viewData.Slider['width']; // часть дистанции в px
    let tipValue = partOfDistance * distance + this.state.min;
    this.notify('getRenderData', {pxValue, tipValue});
  }

  calcCorrectValue() {
    const remainder = this.state.value % this.state.step;
    if (remainder !== 0) { return this.state.value - remainder }
    else { return this.state.value };
  }
}