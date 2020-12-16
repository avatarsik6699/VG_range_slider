import { Controller } from './Controller/Controller';
import { defaultState } from './Core/defaultState';
import { RECRATE_APP } from './Helpers/Constants';
import { State } from './Helpers/Interfaces';

declare global {
  interface JQuery {
    slider(settings?: string | State, callback?: Function): JQuery | undefined;
  }
}

// eslint-disable-next-line func-names
(function ($) {
  const methods = {
    init(settings): JQuery {
      const anchor: HTMLElement = this[0];
      this.data('slider', new Controller(anchor, settings));
      this.data('isInit', true);
      return this;
    },
    hide(): JQuery {
      const slider = this.data('slider');
      slider.app.hide();
      return this;
    },
    show() {
      const slider = this.data('slider');
      slider.app.show();
      return this;
    },
    destroy(): JQuery {
      const slider = this.data('slider');
      this.data('isInit', false);
      slider.app.destroy();
      return this;
    },
    reset(): JQuery {
      const slider = this.data('slider');
      slider.core.setState({ ...defaultState, action: RECRATE_APP });
      return this;
    },
    getState(callback): JQuery {
      const anchor: HTMLElement = this[0];
      anchor.addEventListener('getState', callback);
      return this;
    },
  };

  // eslint-disable-next-line no-param-reassign
  $.fn.slider = (settings = defaultState, callback?): JQuery | undefined => {
    if (!this.data('isInit')) {
      const state = typeof settings === 'object' ? settings : defaultState;
      methods.init.call(this, state);
    } else if (settings === 'getState') {
      methods[settings].call(this, callback);
    } else if (methods[settings as string]) {
      return methods[settings as string].call(this);
    }
    throw new Error(`Метод ${settings} отсутствует у плагина slider`);
  };
})(jQuery);
