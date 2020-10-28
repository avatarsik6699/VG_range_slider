import { Bar } from '../components/Bar/Bar';
import { component } from '../components/component_interface';
import { Handle } from '../components/Handle/Handle';
import { factory } from './factory_interface'

export class VerticalSlider implements factory {
  private sliderComponents: any[] = [Bar, Handle];
  private type: string = 'vertical';
  constructor() {}

  createComponents(): component[] {
    return this.sliderComponents.map( component => {
      return new component(this.type)
    });
  }
}