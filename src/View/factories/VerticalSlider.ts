import { Bar } from '../components/Bar/Bar';
import { component } from '../components/component_interface';
import { Handler } from '../components/Handler/Handler';
import { factory } from './factory_interface'

export class VerticalSlider implements factory {
  private sliderComponents: any[] = [Bar, Handler];
  private type: string = 'vertical';
  constructor() {}

  createComponents(): component[] {
    return this.sliderComponents.map( component => {
      return new component(this.type)
    });
  }
}