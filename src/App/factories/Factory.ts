import { Component, State } from '../../Helpers/Interfaces';
import { Bar } from '../components/Bar/Bar';
import { Handle } from '../components/Handle/Handle';
import { Scale } from '../components/Scale/Scale';
import { Settings } from '../components/Settings/Settings';
import { Slider } from '../components/Slider/Slider';
import { Tooltip } from '../components/Tooltip/Tooltip';

class Factory {
  private multiplyComponents = ['tooltip', 'handle'];

  private components = [Slider, Handle, Tooltip, Scale, Bar, Settings];

  createComponents(anchor: HTMLElement, state: State) {
    const DEFAULT_ID = 0;

    return this._getCorrectComps(this.components, state).reduce((instances, component) => {
      const name = this._getComponentName(component);
      return this.multiplyComponents.includes(name) && state.type === 'range'
        ? { ...instances, [name]: state.value.map((_, id) => new component(anchor, state, id)) }
        : { ...instances, [name]: [new component(anchor, state, DEFAULT_ID)] };
    }, {});
  }

  private _getCorrectComps(components, state: State) {
    return components.reduce((correctComps, component) => {
      return !this._getExcludeComps(state).includes(this._getComponentName(component))
        ? [...correctComps, component]
        : [...correctComps];
    }, []);
  }

  private _getExcludeComps(state: State) {
    return Object.keys(state).reduce((excludeComps: string[] | never[], key) => {
      return this._isFalse(state[key]) ? [...excludeComps, key] : [...excludeComps];
    }, []);
  }

  private _isFalse(field: boolean): boolean {
    return typeof field === 'boolean' ? !field : field === 'false';
  }

  private _getComponentName(component): string {
    return component.prototype.constructor.name.toLowerCase();
  }
}

export { Factory };
