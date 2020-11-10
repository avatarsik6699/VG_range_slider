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
  value: [50,100],
  step: 10,
  position: 'horizontal',
  type: 'range',
  scale: false,
  tooltip: false,
})