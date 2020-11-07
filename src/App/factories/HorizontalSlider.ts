import { Bar } from '../components/Bar/Bar';
import { Handler } from '../components/Handler/Handler';
import { factory } from './factory_interface'
import { ClassElement } from 'typescript';
import { component } from '../components/component_interface';

export class HorizontalSlider implements factory {
  private sliderComponents: any[] = [Bar, Handler];
  private type: string = 'horizontal';
  constructor() {}

  createComponents(): component[] {
    return this.sliderComponents.map( component => {
      return new component(this.type)
    });
  }
}