import { Component, State } from '../../Helpers/Interfaces';
import { Factory } from './Factory';
import { getComponentList } from '../templates/getComponentList';

class HorizontalSlider extends Factory {
  _setComponentList(params: State): void {
    const componentList = getComponentList(params.position);
    const numberComponents = this._getNumberComponents(params.type);
    const correctComponentList = this._getCorrectComponentList(componentList, params);
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

export { HorizontalSlider };