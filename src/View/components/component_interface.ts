export interface component {
  template: string;
  paint(anchor: Element): void;
  setTemplate(type: string): void;
}