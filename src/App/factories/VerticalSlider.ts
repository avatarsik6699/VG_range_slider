import { Component, State } from '../../Helpers/Interfaces';
import { Factory } from './Factory';
import { getComponentList } from '../templates/getComponentList';
import { Slider } from '../components/Slider/Slider';
import { vHandle } from '../components/Handle/Handle';
import { vTooltip } from '../components/Tooltip/Tooltip';
import { vScale } from '../components/Scale/Scale';
import { vBar } from '../components/Bar/Bar';
import { Settings } from '../components/Settings/Settings';

class VerticalSlider extends Factory {
  private components = [Slider, vHandle, vTooltip, vScale, vBar, Settings]
  _getComponentList(params: State) {
    return this._getCorrectComponents(this.components, params);
  }
}

export { VerticalSlider };