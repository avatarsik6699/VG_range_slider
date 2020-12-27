interface State {
  min: number;
  max: number;
  value: number[];
  step: number;
  position: string;
  type: string;
  scale: boolean;
  tooltip: boolean;
  bar: boolean;
  from?: number;
  to?: number;
}

type ComponentInstances = {
  [key: string]: Component[];
};

type MinMax = {
  max: State['max'];
  min: State['min'];
};

type ComponentProps = {
  [name: string]: { [key: string]: number } | number;
};

type ValuePxValue = { px: number; value: number };

interface RenderData {
  eventType?: string;
  targetId: number;
  type: string;
  position: string;
  scaleValues: ValuePxValue[];
  handleSize: number;
  coords: {
    [key: string]: {
      valuePxValue: ValuePxValue;
      prev: number | null;
      next: number | null;
    };
  };
}

type IConstructorComponent = {
  new (anchor: HTMLElement, state: State, id?: number, parentMethods?): Component;
};

interface Component {
  create(state: State, id?: number);
  getName(): string;
  getNode(): HTMLElement;
  getRootElement(): HTMLElement;
  render?(renderData: RenderData);
  subscribe?<T, D>(eventType: string, callback: (data: T) => D): void;
  notify?<T>(eventType: string, data: T): void;
}

interface AppData {
  handleSize: number;
  limit: number;
  id: number;
  pxValue?: number[];
  value?: number[];
  action?: string;
  eventType?: string;
}

type ScaleValues = ValuePxValue[];

interface IFactory {
  createComponents(anchor: HTMLElement, state: State, parentMethods): ComponentInstances;
}

export {
  IFactory,
  ComponentInstances,
  State,
  Component,
  MinMax,
  ComponentProps,
  RenderData,
  ValuePxValue,
  AppData,
  ScaleValues,
  IConstructorComponent,
};
