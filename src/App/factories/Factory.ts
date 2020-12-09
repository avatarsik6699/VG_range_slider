import { Component, State } from '../../Helpers/Interfaces';
abstract class Factory {
  protected multiplyComponents = ['tooltip', 'handle'];
  
  createComponents(anchor: HTMLElement, params: State) {
    const components = this._getComponentList(params);
    const componentInstanceList = {};
    const defaultId = 0;

    components.forEach( component => {
      let name = this._getComponentName(component);
      if (this.multiplyComponents.includes(name) && params.type === 'range') {
        componentInstanceList[name] = params.value.map( (_,id) => new component(anchor, params, id));
      } else {
        componentInstanceList[name] = [new component(anchor, params, defaultId)]
      }
    })
    return componentInstanceList;
  }

  abstract _getComponentList(params: State): any;

  protected _getComponentName(component): string {
    const name = component.prototype.constructor.name;
    if (name === 'Settings') {
      return name.toLowerCase()
    } else if (name === 'Slider') {
      return name.toLowerCase()
    } else {
      return name.slice(1).toLowerCase();
    }
  }

  protected _getCorrectComponents(components, params) {
    const correctComponents: any[] = [];
    const excludeComponents = this._getExcludeComponents(params)

    components.forEach( element => {
      let name = this._getComponentName(element);
      
      if (!excludeComponents.includes(name)) {
        correctComponents.push(element);
      }
    });

    return correctComponents;
  }

  protected _getExcludeComponents(params: State): string[] {
    const excludeComponents: string[] = [];
    for (let key in params) {
      if (this.isFalse(params[key])) { excludeComponents.push(key) }
    }
    return excludeComponents;
  }

  protected isFalse(field: boolean): boolean {
    return typeof field === 'boolean'
    ? !field
    : field === 'false'
  }

}

export { Factory };