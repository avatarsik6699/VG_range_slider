import { Component, State } from '../../Helpers/Interfaces';
import { Factory } from './Factory';
import { getComponentList } from '../templates/getComponentList';

class VerticalSlider extends Factory {
  _setComponentList(params: State): void {
    const numberComponents = this._getNumberComponents(params.type);
    const correctComponentList = this._getCorrectComponentList(getComponentList(params.position), params);
    this.componentList = correctComponentList.map( (component: [string, Component]) => {
      let name = component[0];
      let element = component[1];

      return Object.keys(numberComponents).includes(name) 
        ? [...Array(numberComponents[name]).keys()].map( num => {
          return element;
        })
        : element
    })
  }
}

export { VerticalSlider };