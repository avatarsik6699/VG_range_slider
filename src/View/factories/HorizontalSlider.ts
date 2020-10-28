import { Bar } from '../components/Bar/Bar';
import { Handle } from '../components/Handle/Handle';
import { Basis } from '../components/Basis/Basis';
import { factory } from './factory_interface'
import { ClassElement } from 'typescript';
import { component } from '../components/component_interface';

export class HorizontalSlider implements factory {
  private sliderComponents: any[] = [Bar, Handle];
  private type: string = 'horizontal';
  constructor() {}

  createComponents(): component[] {
    return this.sliderComponents.map( component => {
      return new component(this.type)
    });
  }
}