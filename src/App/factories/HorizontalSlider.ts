import { hBar } from '../components/Bar/Bar';
import { Component, Factory, State } from '../../Helpers/Interfaces';
import { hSlider } from '../components/Slider/Slider';
import { Settings } from '../components/Settings/Settings';
import { hHandle } from '../components/Handle/Handle';
import { hScale } from '../components/Scale/Scale';
import { hTooltip } from '../components/Tooltip/Tooltip';

class HorizontalSlider {
  private componentList: any = [hSlider, hBar, [hHandle], [hTooltip], hScale, Settings];

  createComponents(anchor: HTMLElement | Element, params: State): {} {
    this.setComponentList(params);
    
    let componentInstanceList = {};
    
    this.componentList.forEach( component => {
      if (Array.isArray(component)) {
        let name = component[0].prototype.constructor.name.slice(1).toLowerCase() + 's';
        componentInstanceList[name] = component.map( (subComponent, index) => {
          return new subComponent(anchor, params, index);
        });
      } else {
        let name = component.prototype.constructor.name === 'Settings'
        ? component.prototype.constructor.name.toLowerCase()
        : component.prototype.constructor.name.slice(1).toLowerCase();
        componentInstanceList[name] = new component(anchor, params);
      }
    });

    return componentInstanceList;
  }

  private setComponentList(params: State): void {
    if (params.type === 'range') this.componentList = 
    [hSlider, [hHandle, hHandle], [hTooltip, hTooltip], hScale, hBar, Settings];
    if (params.type === 'single') this.componentList = 
    [hSlider, [hHandle], [hTooltip], hScale, hBar, Settings];
  }
}

export { HorizontalSlider };