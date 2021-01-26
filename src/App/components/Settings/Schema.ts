import { State } from '../../../Helpers/Interfaces';

// схема настроек - отражает State из Core;
const defaultState: State = {
  max: 500,
  min: 10,
  value: [50],
  step: 5,
  direction: 'horizontal',
  type: 'single',
  scale: true,
  tooltip: true,
  bar: true,
  settings: true,
};

const getSchema = (state: State) => ({
  max: { elementType: 'input', valueType: 'number', options: { value: [state.max] } },
  min: { elementType: 'input', valueType: 'number', options: { value: [state.min] } },
  value: { elementType: 'input', valueType: 'number', options: { value: [state.value] } },
  step: { elementType: 'input', valueType: 'number', options: { value: [state.step] } },
  direction: {
    elementType: 'select',
    valueType: 'string',
    options: {
      selected: [state.direction],
      value: ['horizontal', 'vertical'],
    },
  },
  type: {
    elementType: 'select',
    valueType: 'string',
    options: {
      selected: [state.type],
      value: ['single', 'range', 'multiple'],
    },
  },
  scale: {
    elementType: 'select',
    valueType: 'boolean',
    options: {
      selected: [state.scale],
      value: [true, false],
    },
  },
  tooltip: {
    elementType: 'select',
    valueType: 'boolean',
    options: {
      selected: [state.tooltip],
      value: [true, false],
    },
  },
  bar: {
    elementType: 'select',
    valueType: 'boolean',
    options: {
      selected: [state.bar],
      value: [true, false],
    },
  },
  settings: {
    elementType: 'select',
    valueType: 'boolean',
    options: {
      selected: [state.settings],
      value: [true, false],
    },
  },
});
