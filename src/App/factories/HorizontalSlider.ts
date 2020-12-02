import { Component, State } from '../../Helpers/Interfaces';
import { Factory } from './Factory';
import { getComponentList } from '../templates/getComponentList';
import { Slider } from '../components/Slider/Slider';
import { hHandle } from '../components/Handle/Handle';
import { hTooltip } from '../components/Tooltip/Tooltip';
import { hScale } from '../components/Scale/Scale';
import { hBar } from '../components/Bar/Bar';
import { Settings } from '../components/Settings/Settings';

class HorizontalSlider extends Factory {
  private components = [Slider, hHandle, hTooltip, hScale, hBar, Settings]
  _getComponentList(params: State) {
    return this._getCorrectComponents(this.components, params);
  }
}

export { HorizontalSlider };