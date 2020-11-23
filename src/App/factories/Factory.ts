import { State } from '../../Helpers/Interfaces';
abstract class Factory {
  protected componentList: any = [];

  createComponents(anchor: HTMLElement | Element, params: State): {} {
    this._setComponentList(params);
    let componentInstanceList = {};
    
    this.componentList.forEach( component => {
      let name = this._getCorrectComponentName(component);

      componentInstanceList[name] = Array.isArray(component)
      ? component.map((subComponent, id) => new subComponent(anchor, params, id))
      : new component(anchor, params)
    })

    return componentInstanceList;
  }

  abstract _setComponentList(params: State): void;

  protected _getComponentName(component): string {
    return component.prototype.constructor.name
  }

  protected _getCorrectComponentName(component): string {
    if (Array.isArray(component)) {
      return this._getComponentName(component[0]).slice(1).toLowerCase() + 's';
    } else if (this._getComponentName(component) === 'Settings') {
      return this._getComponentName(component).toLowerCase()
    } else {
      return this._getComponentName(component).slice(1).toLowerCase();
    }
  }

  protected _getCorrectComponentList(componentList, params) {
    const exclideList: string[] = this._getExcludeList(params);
    if (exclideList.length === 0) {
      return Object.values(componentList);
    } else {
      for (let key in componentList) {
        if (exclideList.includes(key)) delete componentList[key];
      }
      return Object.values(componentList);
    }
  }

  protected _getExcludeList(params: State): string[] {
    const excludeList: string[] = [];
    for (let key in params) {
      if (typeof params[key] === 'boolean' && !params[key]) {
        excludeList.push(key);
      }
    }
    return excludeList;
  }
}

export { Factory };