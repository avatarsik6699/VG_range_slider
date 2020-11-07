import { Bar } from '../components/Bar/Bar';
import { Component, Factory, State } from '../../Helpers/Interfaces';
import { Handle } from '../components/Handle/Handle';
import { Tooltip } from '../components/Tooltip/Tooltip';

class HorizontalSlider implements Factory {
  private sliderComponents = [Bar, Handle, Tooltip];

  createComponents(params: State): Component[] {
    return this.sliderComponents.map( el => {
      return new el(params)
    });
  }
}

export { HorizontalSlider };