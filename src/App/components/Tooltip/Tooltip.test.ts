// import { JSDOM } from 'jsdom';
// import { expect } from 'chai'
// import { Tooltip } from './Tooltip';

// const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>')
// const document = DOM.window.document;

// describe('Tooltip', () => {
//   let anchor: HTMLElement;
//   let slider: HTMLElement;
//   let handle: HTMLElement

//   beforeEach(() => {
//     anchor = document.querySelector('.anchor') as HTMLElement;
//     slider = document.createElement('div');
//     slider.className = 'slider';
//     anchor.insertAdjacentElement('afterbegin', slider);
    
//     handle = document.createElement('div');
//     handle.className = 'slider__handle';
//     handle.dataset.id = '0';
//     slider.insertAdjacentElement('afterbegin', handle);
//   })

//   afterEach(() => {
//     anchor.innerHTML = '';
//   })

//   it('Должен отрисоваться при начальной инициализации', () => {
//     new hTooltip(anchor, {position: 'horizontal'}, 0);
//     const tooltipNode = anchor.querySelector('.slider__tooltip');
//     expect(tooltipNode?.matches('.slider__tooltip')).to.be.true;
//   })

//   it('(getName) должен вернуть имя в нижнем регистре', () => {
//     const tooltip = new hTooltip(anchor, {position: 'horizontal'}, 0);
//     expect(tooltip.getName()).to.equal('htooltip')
//   })

//   it('(getNode) выбрасывает исключение, если не найден DOM узел', () => {
//     const tooltip = new hTooltip(anchor, {position: 'horizontal'}, 0);
//     anchor.querySelector(`.slider__tooltip[data-id="0"]`)?.remove();
//     expect(() => tooltip.getNode(anchor, 0)).to.throw(`tooltip wasn't found`);
//   })

//   it('(setTemplate) выбрасывает исключение, если отсутствуте поле position в params', () => {
//     const tooltip = new hTooltip(anchor, {position: 'horizontal'}, 0);
//     //@ts-ignore
//     expect(() => tooltip.setTemplate({})).to.throw('position in params wasn\'t found');
//   })

//   it('(getRootElement) должен вернуть родительский элемент', () => {
//     const tooltip = new hTooltip(anchor, {position: 'horizontal'}, 0);
//     const tooltipParent = anchor.querySelector(`.slider__handle[data-id="0"]`);
//     expect(tooltip.getRootElement(anchor)).to.equal(tooltipParent);
//   })

//   describe('hTooltip', () => {
//     it('(render) должен менять значение в зависимости от value в renderData', () => {
//       const tooltip = new hTooltip(anchor, {position: 'horizontal'}, 0);
//       //@ts-ignore
//       tooltip.render(anchor, {0: {value: 50}});
//       const tooltipNode = anchor.querySelector('.slider__tooltip');
//       expect(tooltipNode?.textContent).to.equal('50');
//     })

//     it('(render) должен правильно вычислять offset', () => {
//       const tooltip = new hTooltip(anchor, {position: 'horizontal'}, 0);
//        //@ts-ignore
//       tooltip.render(anchor, {0: {value: 1000}});
//       const tooltipNode = anchor.querySelector('.slider__tooltip') as HTMLElement;
//       expect(tooltipNode?.style.left).to.equal('-12px')
//     })
//   })

//   describe('vTooltip', () => {
//     it('(render) должен менять значение в зависимости от value в renderData', () => {
//       const tooltip = new vTooltip(anchor, {position: 'horizontal'}, 0);
//       //@ts-ignore
//       tooltip.render(anchor, {0: {value: 50}});
//       const tooltipNode = anchor.querySelector('.slider__tooltip');
//       expect(tooltipNode?.textContent).to.equal('50');
//     })
//   })
// })