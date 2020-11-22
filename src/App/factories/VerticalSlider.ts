import { State } from "../../Helpers/Interfaces";
import { vBar } from "../components/Bar/Bar";
import { vHandle } from "../components/Handle/Handle";
import { vScale } from "../components/Scale/Scale";
import { Settings } from "../components/Settings/Settings";
import { vSlider } from "../components/Slider/Slider";
import { vTooltip } from "../components/Tooltip/Tooltip";

class VerticalSlider {
  private componentList: any = [vSlider, vBar, [vHandle], [vTooltip], vScale, Settings];

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
    [vSlider, [vHandle, vHandle], [vTooltip, vTooltip], vBar, vScale, Settings];
    if (params.type === 'single') this.componentList = 
    [vSlider, [vHandle], [vTooltip], vBar, vScale, Settings];
  }
}

export { VerticalSlider };