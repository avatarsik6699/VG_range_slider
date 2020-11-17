import { State } from "../Helpers/Interfaces";

export const defaultCoreState: State = {
	max: 500,
	min: 10,
  value: [50],
  step: 5,
  position: 'horizontal',
  type: 'single',
  scale: true,
  tooltip: true,
  handle: true,
  bar: true,
}