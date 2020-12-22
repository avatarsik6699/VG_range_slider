import Controller from './Controller/Controller';
import defaultState from './Core/defaultState';
import { RECRATE_APP } from './Helpers/Constants';
import { State } from './Helpers/Interfaces';

declare global {
  interface JQuery {
    slider(settings?: string | State, callback?: <T, D>(ev: T) => D): JQuery | undefined;
  }
}

(function ($) {
  const methods = {
    init(settings): JQuery {
      const anchor: HTMLElement = this[0];
      this.data('slider', new Controller(anchor, settings));
      this.data('isInit', true);
      return this;
    },
    hide(): JQuery {
      if (!this.data('isInit')) throw new Error('Слайдер не инициализирован');
      const slider = this.data('slider');
      slider.app.hide();
      return this;
    },
    show() {
      if (!this.data('isInit')) throw new Error('Слайдер не инициализирован');
      const slider = this.data('slider');
      slider.app.show();
      return this;
    },
    destroy(): JQuery {
      if (!this.data('isInit')) throw new Error('Слайдер не инициализирован');
      const slider = this.data('slider');
      this.data('isInit', false);
      slider.app.destroy();
      return this;
    },
    reset(): JQuery {
      if (!this.data('isInit')) throw new Error('Слайдер не инициализирован');
      const slider = this.data('slider');
      slider.core.setState({ ...defaultState, action: RECRATE_APP });
      return this;
    },
    getState(callback): JQuery {
      if (!this.data('isInit')) throw new Error('Слайдер не инициализирован');
      const anchor: HTMLElement = this[0];
      anchor.addEventListener('getState', callback);
      return this;
    },
  };

  // eslint-disable-next-line no-param-reassign
  $.fn.slider = function (settings = defaultState, callback?): JQuery {
    if (typeof settings === 'object') {
      return methods.init.call(this, settings);
    }
    if (settings === 'getState') {
      return methods[settings].call(this, callback);
    }
    if (methods[settings as string]) {
      return methods[settings as string].call(this);
    }
    throw new Error(`Метод ${settings} отсутствует у плагина slider`);
  };
})(jQuery);
