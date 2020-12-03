import { State } from "../Helpers/Interfaces";

const defaultState: State = {
	max: 500,
	min: 10,
  value: [50],
  step: 5,
  position: 'horizontal',
  type: 'single',
  scale: true,
  tooltip: true,
  bar: true,
}

export { defaultState }