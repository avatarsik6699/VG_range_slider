import { component } from "../components/component_interface";

export interface factory {
  createComponents(type: string): component[];
}