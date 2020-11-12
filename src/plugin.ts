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
	max: 500,
	min: 0,
  value: 500,
  step: 1,
  position: 'horizontal',
  type: 'single', //range, multiply{3}
  scale: false,
  tooltip: false,
  handle: true,
  bar: true,
})