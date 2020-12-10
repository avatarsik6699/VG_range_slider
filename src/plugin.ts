import { Controller } from "./Controller/Controller";
import { defaultState } from "./Core/defaultState";
import { State } from "./Helpers/Interfaces";
declare global {
    interface JQuery {
    slider(settings?: string | State): JQuery;
  }
}

(function($) {
  const methods = {
    init(settings)  {
      let anchor: HTMLElement = this[0];
      this.data('slider', new Controller(anchor, settings))
      // this.data('slider').core.setState(settings);
    },
    hide() {
      const slider = this.data('slider');
      if (!slider) throw new Error('Слайдер не инициализирован');
      slider.app.hide();
    },
    show() {
      const slider = this.data('slider');
      if (!slider) throw new Error('Слайдер не инициализирован');
      slider.app.show();
    },
    destroy() {
      const slider = this.data('slider');
      if (!slider) throw new Error('Слайдер не инициализирован');
      slider.app.destroy();
    },
    reset() {
      this.data('slider').core.setState(defaultState);
    }
  }
  
  $.fn.slider = function(settings = defaultState) {
    if (methods[<string>settings]) {
      return methods[<string>settings].call(this)
    } else if (typeof settings === 'object') {
      return methods.init.call(this, settings);
    } else {
      throw new Error(`Метод ${settings} отсутствует у плагина slider`)
    }
  }
})(jQuery)

let settings = {
	max: 1000,
	min: 100,
  value: [300, 400],
  step: 1,
  position: 'horizontal',
  type: 'range',
  scale: true,
  tooltip: true,
  bar: true,
  settings: true,
}

const $slider = $('.anchor').slider(settings)

