import { State } from '../../Helpers/Interfaces';
import { Factory } from './Factory';
import { rangeSliderTemplate } from '../templates/rangeSliderTemplate';
import { singleSliderTemplate } from '../templates/singleSliderTemplate';

class VerticalSlider extends Factory {
  _setComponentList(params: State): void {
    let componentList = params.type === 'range'
    ? rangeSliderTemplate(params)
    : singleSliderTemplate(params);
    this.componentList = this._getCorrectComponentList(componentList, params);
  }
}

export { VerticalSlider };