import { ComponentInstances, IConstructorComponent, IFactory, State } from '../../Helpers/Interfaces';
import Bar from '../components/Bar/Bar';
import Handle from '../components/Handle/Handle';
import Scale from '../components/Scale/Scale';
import Settings from '../components/Settings/Settings';
import Slider from '../components/Slider/Slider';
import Tooltip from '../components/Tooltip/Tooltip';

class Factory implements IFactory {
  private multipleComponents = ['tooltip', 'handle'];

  private components: IConstructorComponent[] = [Slider, Handle, Tooltip, Scale, Bar, Settings];

  createComponents(anchor: HTMLElement, state: State, parentMethods): ComponentInstances {
    const DEFAULT_ID = 0;

    const result = this.getCorrectComponents(this.components, state).reduce((instances, Сomponent) => {
      const name = this.getComponentName(Сomponent);
      return this.multipleComponents.includes(name) && state.type !== 'single'
        ? { ...instances, [name]: state.value.map((_, id) => new Сomponent(anchor, state, id, parentMethods)) }
        : { ...instances, [name]: [new Сomponent(anchor, state, DEFAULT_ID, parentMethods)] };
    }, {});
    return result;
  }

  private getCorrectComponents(components: IConstructorComponent[], state: State): IConstructorComponent[] {
    return components.reduce(
      (correctComps: IConstructorComponent[], component) =>
        !this.getExcludeComponents(state).includes(this.getComponentName(component))
          ? [...correctComps, component]
          : [...correctComps],
      [],
    );
  }

  private getExcludeComponents(state: State): string[] {
    return Object.keys(state).reduce(
      (excludeComponents: string[], key) =>
        this.isFalse(state[key]) ? [...excludeComponents, key] : [...excludeComponents],
      [],
    );
  }

  private isFalse(field: boolean): boolean {
    return typeof field === 'boolean' ? !field : field === 'false';
  }

  private getComponentName(component: IConstructorComponent): string {
    return component.prototype.constructor.name.toLowerCase();
  }
}

export default Factory;
