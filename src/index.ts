import './style.scss';
import './plugin';

const settings = {
	max: 1000,
	min: 100,
  value: [355],
  step: 1,
  position: 'horizontal',
  type: 'single',
  scale: true,
  tooltip: true,
  bar: true,
}

$('.anchor').slider(settings)
$('.root').slider(settings)