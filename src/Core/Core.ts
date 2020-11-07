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
  }

  getState() {
    return this.state;
  }
}