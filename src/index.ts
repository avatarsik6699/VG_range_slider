import './style.scss';
import './plugin';
import Selector from './App/components/Settings/Selector';
import Input from './App/components/Settings/Input/Input';

const settings = {
  max: 1000,
  min: 100,
  value: [355, 555, 666, 400, 300],
  step: 1,
  position: 'horizontal',
  type: 'single',
  scale: true,
  tooltip: true,
  bar: true,
  settings: true,
};
const selector = new Selector(
  document.querySelector(
    'select[name="custom-select"]',
  ) as HTMLSelectElement,
);
// console.log(selector);
// $('.js-anchor').slider(settings);
// $('.js-root').slider(settings);
const customInput = new Input(
  document.querySelector('.js-root'),
  {
    a: 1,
  },
  1,
);
console.log(customInput);
