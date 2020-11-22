import { Controller } from "./Controller/Controller";
import { defaultCoreState } from "./Core/defaultCoreState";
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
      this.data('slider', new Controller(anchor))
      this.data('slider').core.setState(settings);
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
      this.data('slider').core.setState(defaultCoreState);
    }
  }
  
  $.fn.slider = function(settings = defaultCoreState) {
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
	max: 100,
	min: 10,
  value: [10],
  step: 5,
  position: 'horizontal',
  type: 'single',
  scale: false,
  tooltip: false,
  handle: true,
  bar: true,
}

const $slider = $('.anchor').slider(settings)

