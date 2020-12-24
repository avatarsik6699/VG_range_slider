import './style.scss';
import './plugin';

const settings = {
  max: 1000,
  min: 100,
  value: [355, 555, 666, 400, 300],
  step: 1,
  position: 'horizontal',
  type: 'multiple',
  scale: true,
  tooltip: true,
  bar: true,
  settings: true,
};

$('.js-anchor').slider(settings);
$('.js-root').slider(settings);
