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
	max: 100,
	min: 0,
  value: 50,
  step: 2,
  position: 'horizontal',
  type: 'single',
  scale: false,
  tooltip: true,
})