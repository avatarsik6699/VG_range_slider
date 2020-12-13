import { expect } from 'chai';
import { Core } from './Core';
import { JSDOM } from 'jsdom';
import { defaultState } from './defaultState';

// const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>');
// const document = DOM.window.document
const newState = {
	max: 1000,
	min: 100,
  value: [355],
  step: 1,
  position: 'horizontal',
  type: 'single',
  scale: true,
  tooltip: true,
  bar: true,
}

describe('Core', () => {

  it ('При начальной инициализации state === newState', () => {
    const core = new Core(newState);
    expect(core.getState()).to.deep.equal(newState);
  })

  it('(setState) корректирует min/max и устанавливает новое состояние', () => {
    const core = new Core(newState);
    core.setState({
      ...core.getState(),
      max: 500,
      min: 1000,
    })
    expect(core.getState().max).to.eq(1000);
    expect(core.getState().min).to.eq(500);
    
    core.setState({
      ...core.getState(),
      max: -300,
      min: -200,
    })
    expect(core.getState().max).to.eq(-200);
    expect(core.getState().min).to.eq(-300);
    
    core.setState({
      ...core.getState(),
      max: 100,
      min: 100,
    })
    expect(core.getState().max).to.eq(100);
    expect(core.getState().min).to.eq(99);
  })

  it('(setState) корректирует step и устанавливает новое состояние', () => {
    const core = new Core(newState);
    core.setState({
      ...core.getState(),
      max: 100,
      step: 101,
    })
    expect(core.getState().step).to.eq(1);

    core.setState({
      ...core.getState(),
      step: -999,
    })
    expect(core.getState().step).to.eq(1);
  })

  it('(setState) корректирует value и устанавливает новое состояние', () => {
    const core = new Core(newState);
    core.setState({
      ...core.getState(),
      max: 100,
      min: 10,
      //@ts-ignore
      value: 20,
    })
    expect(core.getState().value).to.deep.eq([20])

    core.setState({
      ...core.getState(),
      max: 100,
      min: 10,
      value: [1],
    })
    expect(core.getState().value).to.deep.eq([10])

    core.setState({
      ...core.getState(),
      max: 100,
      min: 10,
      value: [150],
    })
    expect(core.getState().value).to.deep.eq([100])

    core.setState({
      ...core.getState(),
      max: 100,
      min: 10,
      value: [100,50],
    })
    expect(core.getState().value).to.deep.eq([50,100])

    core.setState({
      ...core.getState(),
      max: 100,
      min: 10,
      value: [-50,-100],
    })
    expect(core.getState().value).to.deep.eq([10,10])

    core.setState({
      ...core.getState(),
      max: 100,
      min: 10,
      value: [300,200],
    })
    expect(core.getState().value).to.deep.eq([100,100])
  })

  it('(setState) корректирует все поля и устанавливает новое состояние', () => {
    const core = new Core(newState);
    core.setState({
      ...core.getState(),
      max: 50,
      min: 100,
      //@ts-ignore
      value: 333,
      step: -999
    })
    expect(core.getState().max).to.eq(100);
    expect(core.getState().min).to.eq(50);
    expect(core.getState().value).to.deep.eq([100]);
    expect(core.getState().step).to.eq(1);
    
    core.setState({
      ...core.getState(),
      max: 50,
      min: 100,
      value: [1000,999],
      step: -999
    })
    expect(core.getState().max).to.eq(100);
    expect(core.getState().min).to.eq(50);
    expect(core.getState().value).to.deep.eq([100, 100]);
    expect(core.getState().step).to.eq(1);
  })

  it('(getRenderData) должен вернуть объект с правильными данными для рендера', () => {
    const core = new Core(newState);
    const renderData = core.getRenderData({limit: 300, handleSize: 20, id: 0})
    expect(renderData[0]).to.deep.eq({pxValue: 79.33333333333333, value: 355})
    expect(renderData['handleSize']).to.eq(20);
    expect(renderData['position']).to.eq('horizontal');
    expect(renderData['type']).to.eq('single')
  })

  it('(getScaleValues) должен вернуть значения для шкалы', () => {
    const core = new Core(newState);
    const state = core.getState();
    //@ts-ignore
    const distance = core._getDistance(state.min, state.max);
    //@ts-ignore
    const ratio = core._getRatio(300, 20, distance);
    //@ts-ignore
    const scaleValues = core._calcScaleValues(ratio, distance);
    expect(scaleValues).to.deep.eq([
      {pxValue: 0, value: 100},
      {pxValue: 56, value: 280},
      {pxValue: 112, value: 460},
      {pxValue: 168, value: 640},
      {pxValue: 224, value: 820},
      {pxValue: 280, value: 1000},
    ])
  })
})