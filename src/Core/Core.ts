export class Model {
  defaultState: any = {
    min: 1,
    max: 10,
    value: 5,
    step: 1,
    position: 'horizontal',
    type: 'single',
    scale: false,
    tooltip: false,
  };
  constructor(private options: {}) {
    this.setState(options);
  }

  setState(options) {
    this.defaultState = {...this.defaultState, ...options};
  }
}