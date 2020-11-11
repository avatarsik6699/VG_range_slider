import { Bar } from '../components/Bar/Bar';
import { Component, Factory, State } from '../../Helpers/Interfaces';
import { Handle } from '../components/Handle/Handle';
import { Tooltip } from '../components/Tooltip/Tooltip';
import { Scale } from '../components/Scale/Scale';

class HorizontalSlider implements Factory {
  private componentList: any = [Bar, [Handle], Scale];

  createComponents(params: State): {} {
    this.setComponentList(params);
    
    let componentInstanceList = {};
    
    this.componentList.forEach( el => {
      if (Array.isArray(el)) {
        componentInstanceList['handles'] = el.map( (subElement, index) => {
          return new subElement(params, index);
        });
      } else {
        let name = el.prototype.constructor.name.toLowerCase();
        componentInstanceList[name] = new el(params);
      }
    });

    return componentInstanceList;
  }

  setComponentList( params: State, customCheckList?: string[] ): void {
    // let checkList: any[] = customCheckList ? customCheckList : [['scale', Scale], ['tooltip', Tooltip]];
    if (params.type === 'range') this.componentList = [Bar, [Handle, Handle], Scale];
    if (params.type === 'single') this.componentList = [Bar, [Handle], Scale];

    // let newComponents = checkList.map( el => {
    //   console.log(params[el[0]])
    //   if (params[el[0]]) return el[1];
    // });

    // console.log(newComponents)
    // this.componentList.concat(newComponents);
  }
}

export { HorizontalSlider };