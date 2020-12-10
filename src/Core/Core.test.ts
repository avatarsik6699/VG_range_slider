// import { expect } from 'chai';
// import { Core } from './Core';
// import { JSDOM } from 'jsdom';
// import { defaultState } from './defaultState';

// const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>');
// const document = DOM.window.document
// const newState = {
// 	max: 1000,
// 	min: 100,
//   value: [355],
//   step: 1,
//   position: 'horizontal',
//   type: 'single',
//   scale: true,
//   tooltip: true,
//   bar: true,
// }

// describe('Core', () => {
//   let anchor: HTMLElement;

//   it ('При начальной инициализации state устанавливается как defaultState', () => {
//     const core = new Core();
//     expect(core.getState()).to.deep.equal(defaultState);
//   })

//   it('(setState) корректирует min/max и устанавливает новое состояние', () => {
//     const core = new Core();
//     core.setState({
//       ...defaultState,
//       max: 500,
//       min: 1000,
//     })
//     expect(core.getState().max).to.eq(1000);
//     expect(core.getState().min).to.eq(500);
//     core.setState({
//       ...defaultState,
//       max: -300,
//       min: -200,
//     })
//     expect(core.getState().max).to.eq(-200);
//     expect(core.getState().min).to.eq(-300);
//     core.setState({
//       ...defaultState,
//       max: 100,
//       min: 100,
//     })
//     expect(core.getState().max).to.eq(100);
//     expect(core.getState().min).to.eq(99);
//   })

//   it('(setState) корректирует step и устанавливает новое состояние', () => {
//     const core = new Core();
//     core.setState({
//       ...defaultState,
//       max: 100,
//       step: 101,
//     })
//     expect(core.getState().step).to.eq(1);
//     core.setState({
//       ...defaultState,
//       step: -999,
//     })
//     expect(core.getState().step).to.eq(1);
//   })

//   it('(setState) корректирует value и устанавливает новое состояние', () => {
//     const core = new Core();
//     core.setState({
//       ...defaultState,
//       max: 100,
//       min: 10,
//       //@ts-ignore
//       value: 20,
//     })
//     expect(core.getState().value).to.deep.eq([20])
//     core.setState({
//       ...defaultState,
//       max: 100,
//       min: 10,
//       value: [1],
//     })
//     expect(core.getState().value).to.deep.eq([10])
//     core.setState({
//       ...defaultState,
//       max: 100,
//       min: 10,
//       value: [150],
//     })
//     expect(core.getState().value).to.deep.eq([100])
//     core.setState({
//       ...defaultState,
//       max: 100,
//       min: 10,
//       value: [100,50],
//     })
//     expect(core.getState().value).to.deep.eq([50,100])
//     core.setState({
//       ...defaultState,
//       max: 100,
//       min: 10,
//       value: [-50,-100],
//     })
//     expect(core.getState().value).to.deep.eq([10,10])
//     core.setState({
//       ...defaultState,
//       max: 100,
//       min: 10,
//       value: [300,200],
//     })
//     expect(core.getState().value).to.deep.eq([100,100])
//   })

//   it('(setState) корректирует все поля и устанавливает новое состояние', () => {
//     const core = new Core();
//     core.setState({
//       ...defaultState,
//       max: 50,
//       min: 100,
//       //@ts-ignore
//       value: 999,
//       step: -999
//     })
//     expect(core.getState().max).to.eq(100);
//     expect(core.getState().min).to.eq(50);
//     expect(core.getState().value).to.deep.eq([100]);
//     expect(core.getState().step).to.eq(1);
    
//     core.setState({
//       ...defaultState,
//       max: 50,
//       min: 100,
//       value: [1000,999],
//       step: -999
//     })
//     expect(core.getState().max).to.eq(100);
//     expect(core.getState().min).to.eq(50);
//     expect(core.getState().value).to.deep.eq([100, 100]);
//     expect(core.getState().step).to.eq(1);
//   })
// })