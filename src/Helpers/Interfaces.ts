interface State {
  min: number,
  max: number,
  value: number,
  step: number,
  position: string,
  type: string,
  scale: boolean,
  tooltip: boolean,
}

interface Template {
  template: string;
  render(anchor: Element): void;
  getNode(anchor: Element): Element
}

interface Factory {
  createComponents(params: {type: string, scale: boolean, tooltip: boolean}): Component[];
}

interface Component {
  template: string;
  render(anchor: Element | HTMLElement, renderParams?: any): void
  setTemplate(type: string): void;
  getNode(anchor: HTMLElement | Element): Element;
  getName(): string;
  update?(anchor: Element | HTMLElement, renderParams: {[name: string]: number}): void
}

export { State, Template, Factory, Component };