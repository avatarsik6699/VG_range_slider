import { App } from "../App";

const getDefaultSpecialCoords = function(this: App) { 
  return {
    'handleSize': () => {
      const handle = this.anchor.querySelector('.slider__handle')!;
      return this.params.position === 'vertical'
      ? handle.getBoundingClientRect().height
      : handle.getBoundingClientRect().width
    },

    'limit': () => {
      const slider = this.anchor.querySelector('.slider')!;
      return this.params.position === 'vertical'
      ? slider.getBoundingClientRect().height
      : slider.getBoundingClientRect().width
    },

    'handlesCoord': () => {
      const handles = Array.from(this.anchor.querySelectorAll('[data-component="handle"]'));
      const slider = this.anchor.querySelector('.slider')!;
      return handles.map( el => {
        return this.params.position === 'vertical'
        ? el.getBoundingClientRect().top - slider.getBoundingClientRect().top
        : el.getBoundingClientRect().left - slider.getBoundingClientRect().left
      })
        
    }
  }
}

export { getDefaultSpecialCoords }