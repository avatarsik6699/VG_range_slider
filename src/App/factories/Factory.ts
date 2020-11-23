import { Component, State } from '../../Helpers/Interfaces';
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

  protected _getCorrectComponentList(componentList: {[key: string]: Component}, params): [string, Component][] {
    const excludeComponents: string[] = this._getExcludeComponents(params);
      for (let key in componentList) {
        if (excludeComponents.includes(key)) { delete componentList[key] }
      }
      return Object.entries(componentList);
  }

  protected _getExcludeComponents(params: State): string[] {
    const excludeComponents: string[] = [];
    for (let key in params) {
      if (this.isFalse(params[key])) { excludeComponents.push(key) }
    }
    return excludeComponents;
  }

  protected _getNumberComponents(type) {
    return type === 'range'
    ? { handle: 2, tooltip: 2 }
    : { handle: 1, tooltip: 1}
  }

  protected isFalse(field: boolean): boolean {
    return typeof field === 'boolean' && !field;
  }

}

export { Factory };