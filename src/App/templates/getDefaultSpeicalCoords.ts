import { App } from "../App";

const getDefaultSpecialCoords = function(this: App): {[name: string]: () => number | number[]} { 
  return {
    'handleSize': (): number => {
      const handle = this.anchor.querySelector('.slider__handle')!;
      return this.params.position === 'vertical'
      ? handle.getBoundingClientRect().height
      : handle.getBoundingClientRect().width
    },

    'limit': (): number => {
      const slider = this.anchor.querySelector('.slider')!;
      return this.params.position === 'vertical'
      ? slider.getBoundingClientRect().height
      : slider.getBoundingClientRect().width
    },

    'handlesCoord': (): number[] => {
      const handles = <HTMLElement[]>this.getNode('handle', {allNodes: true});
      const sliderTop = this.getCoord('slider', 'top');
			// const halfHandleSize = <number>this._getSpecialCoord('handleSize') / 2;

			return this.params.position === 'horizontal'
			? handles.map( handle => this.getCoord(handle, 'left'))
			: handles.map( handle => Math.abs(sliderTop - this.getCoord(handle, 'top')))
    }
  }
}

export { getDefaultSpecialCoords }