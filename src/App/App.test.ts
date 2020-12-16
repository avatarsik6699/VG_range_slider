import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { defaultState } from '../Core/defaultState';
import { Component } from '../Helpers/Interfaces';
import { App } from './App';
import { Bar } from './components/Bar/Bar';
import { Handle } from './components/Handle/Handle';
import { Scale } from './components/Scale/Scale';
import { Settings } from './components/Settings/Settings';
import { Slider } from './components/Slider/Slider';
import { Tooltip } from './components/Tooltip/Tooltip';
import { FactorySelector } from './FactorySelector';

const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>');
const { document } = DOM.window;
const components = [Slider, Handle, Tooltip, Scale, Bar, Settings];

const compareComponent = (instanceList, classList) => {
  Object.values(instanceList).forEach((instance, index) =>
    (instance as Component[]).forEach((el) => {
      expect(el).to.be.instanceOf(classList[index]);
    }),
  );
};

const renderData = {
  0: { pxValue: 64, value: 306 },
  handleSize: 20,
  id: 0,
  position: 'horizontal',
  type: 'single',
  scaleValues: [
    { pxValue: 0, value: 100 },
    { pxValue: 56, value: 280 },
    { pxValue: 112, value: 460 },
    { pxValue: 168, value: 640 },
    { pxValue: 224, value: 820 },
    { pxValue: 280, value: 1000 },
  ],
};

describe('App', () => {
  let anchor: HTMLElement;

  beforeEach(() => {
    anchor = document.querySelector('.anchor') as HTMLElement;
  });

  afterEach(() => {
    anchor.innerHTML = '';
  });

  it('(create) должен создать экземпляры компонентов', () => {
    const app = new App(anchor, new FactorySelector());
    app.create({ ...defaultState, type: 'single', position: 'horizontal' });
    // @ts-ignore
    compareComponent(app.instances, components);

    app.create({ ...defaultState, type: 'range', position: 'horizontal' });
    // @ts-ignore
    compareComponent(app.instances, components);

    app.create({ ...defaultState, type: 'single', position: 'vertical' });
    // @ts-ignore
    compareComponent(app.instances, components);

    app.create({ ...defaultState, type: 'range', position: 'vertical' });
    // @ts-ignore
    compareComponent(app.instances, components);
  });

  it('(create) должны отрисоваться subViews', () => {
    const app = new App(anchor, new FactorySelector());
    app.create({ ...defaultState, type: 'single', position: 'horizontal' });
    expect(anchor.querySelectorAll('.settings').length).to.eq(1);
    expect(anchor.querySelectorAll('.slider').length).to.eq(1);
    expect(anchor.querySelectorAll('.settings').length).to.eq(1);
    expect(anchor.querySelectorAll('.slider__bar').length).to.eq(1);
    expect(anchor.querySelectorAll('.slider__handle').length).to.eq(1);
    expect(anchor.querySelectorAll('.slider__tooltip').length).to.eq(1);
  });

  it('(reCreate) перерисовывает приложение с новым состоянием', () => {
    const app = new App(anchor, new FactorySelector());
    app.create({ ...defaultState, type: 'single', position: 'horizontal' });
    // @ts-ignore
    compareComponent(app.instances, components);
    app.reCreate({ ...defaultState, type: 'range', position: 'vertical' });
    // @ts-ignore
    compareComponent(app.instances, components);
  });

  it('(renderUI) должен отрисовывать приложение по переданным данным', () => {
    const app = new App(anchor, new FactorySelector());
    app.create({ ...defaultState, type: 'single', position: 'horizontal' });
    app.renderUI(renderData);
    const handle = anchor.querySelector('.slider__handle') as HTMLElement;
    const tooltip = anchor.querySelector('.slider__tooltip') as HTMLElement;
    const bar = anchor.querySelector('.slider__bar') as HTMLElement;
    expect(handle.style.left).to.eq('64px');
    expect(tooltip.style.left).to.eq('-8px');
    expect(bar.style.left).to.eq('0px');
    expect(bar.style.width).to.eq('84px');
  });
});
