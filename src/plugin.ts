import { Controller } from "./Controller/Controller";
declare global {
    interface JQuery {
    slider(options: object): JQuery;
  }
} 

(function($) {
  $.fn.slider = function(setting) {
    const options = $.extend({}, setting)
    const anchor: HTMLElement = this[0];
    const controller = new Controller(anchor, options);
    return this;
  }
})(jQuery)

const $slider = $('.anchor').slider({
	max: 9000,
	min: 100,
  value: [10],
  step: 50,
  position: 'horizontal',
  type: 'single', //range, multiply{3}
  scale: false,
  tooltip: false,
  handle: true,
  bar: true,
})