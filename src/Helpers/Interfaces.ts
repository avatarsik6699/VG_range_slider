interface State {
  min: number,
  max: number,
  value: number[],
  step: number,
  position: string,
  type: string,
  scale: boolean,
  tooltip: boolean,
  bar: boolean,
  from?: number,
  to?:number,
}

interface Factory {
  createComponents(params: {type: string, scale: boolean, tooltip: boolean}): {};
}

interface Component {
  template: string;
  create(anchor: Element | HTMLElement, renderParams?: any): this
  setTemplate(type: string, handleId: number): void;
  getNode(anchor: HTMLElement | Element, handleId?: number): Element;
  update?(anchor: Element | HTMLElement, renderParams: {[name: string]: number | string} | any, handleId?: any): void
}

type MinMax = {
  max: State['max'];
  min: State['min'];
}

type ComponentProps = { 
  [name: string]: {[key: string]: number} | number 
};

export { State, Factory, Component, MinMax, ComponentProps };