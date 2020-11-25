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

// type SpecialCoord = {
//   (coord: string | [string, () => number]): {
//     [name: string]: number
//   }
// }

export { State, Factory, Component, MinMax, ComponentProps };