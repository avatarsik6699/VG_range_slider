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
    this.calcCorrectValue();
    console.log(viewData);
  }

  calcCorrectValue() {
    const remainder = this.state.value % this.state.step;
    if (remainder !== 0) { return this.state.value - remainder }
    else { return this.state.value };
  }
}