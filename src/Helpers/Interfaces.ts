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
  render(anchor: Element | HTMLElement, renderData: any, id?: number);
}

type MinMax = {
  max: State['max'];
  min: State['min'];
}

type ComponentProps = { 
  [name: string]: {[key: string]: number} | number 
};

type ValuePxValue = { pxValue: number; value: number }

interface RenderData {
  id: number;
  type: string;
  position: string;
  scaleValues: ValuePxValue[];
  handleSize: number;
  [key: number]: ValuePxValue;
}

interface Component {
  getName(): string;
  getNode(anchor: HTMLElement): HTMLElement;
  getRootElement(anchor: Element): Element;
}

export { State, Factory, Component, MinMax, ComponentProps, RenderData, ValuePxValue };