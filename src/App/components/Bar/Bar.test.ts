import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { Bar } from './Bar';

const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>');
const { document } = DOM.window;

// Общие наследуемые свйоства от абстрактного класса Bar тестируются через hBar
describe('Bar', () => {
  let anchor: HTMLElement;
  let slider: HTMLElement;

  beforeEach(() => {
    anchor = <HTMLElement>document.body.querySelector('.anchor');
    slider = document.createElement('div');
    slider.className = 'slider';

    anchor.insertAdjacentElement('afterbegin', slider);
  });

  afterEach(() => {
    anchor.innerHTML = '';
  });

  it('(getNode) выбрасывает исключение, если bar не найден', () => {
    const bar = new Bar(anchor, { position: 'horizontal' });
    document.querySelector('.slider__bar')?.remove();
    expect(() => bar.getNode(anchor)).to.throw("Bar wasn't found");
  });

  it('(setTemplate) выбрасывает исключение, если некорректно задана позиция', () => {
    const bar = new Bar(anchor, { position: 'horizontal' });
    // @ts-ignore
    expect(() => bar._setTemplate({})).to.throw("position wasn't found or incorrect");
  });

  it('(getName) возвращает имя в нижнем регистре', () => {
    const bar = new Bar(anchor, { position: 'horizontal' });
    expect(bar.getName()).to.equal('bar');
  });

  it('(render) выбрасывает исключение если неправильно передан renderData', () => {
    const bar = new Bar(anchor, { position: 'horizontal' });

    // @ts-ignore
    expect(() => bar.render(anchor, {})).to.throw("type or handleSize wasn't found in renderData");
    // @ts-ignore
    expect(() => bar.render(anchor, { type: 'single' })).to.throw("type or handleSize wasn't found in renderData");
  });

  it('(render) должен правильно отрисовать горизонтальный single/range слайдер', () => {
    const bar = new Bar(anchor, { position: 'horizontal' });
    bar.render(anchor, {
      // @ts-ignore
      0: { pxValue: 50 },
      type: 'single',
      handleSize: 20,
      position: 'horizontal',
    });

    let barNode = bar.getNode(anchor);
    expect(barNode.style.left).to.eq('0px');
    expect(barNode.style.width).to.eq('70px');

    bar.render(anchor, {
      // @ts-ignore
      0: { pxValue: 20 },
      // @ts-ignore
      1: { pxValue: 50 },
      type: 'range',
      handleSize: 20,
      position: 'horizontal',
    });

    barNode = bar.getNode(anchor);
    expect(barNode.style.left).to.eq('20px');
    expect(barNode.style.width).to.eq('50px');
  });

  it('(render) должен правильно отрисовать вертикальный single/range слайдер', () => {
    const bar = new Bar(anchor, { position: 'vertical' });
    bar.render(anchor, {
      // @ts-ignore
      0: { pxValue: 50 },
      type: 'single',
      handleSize: 20,
      position: 'vertical',
    });

    let barNode = bar.getNode(anchor);
    expect(barNode.style.top).to.eq('0px');
    expect(barNode.style.height).to.eq('70px');

    bar.render(anchor, {
      // @ts-ignore
      0: { pxValue: 20 },
      // @ts-ignore
      1: { pxValue: 50 },
      type: 'range',
      handleSize: 20,
      position: 'vertical',
    });

    barNode = bar.getNode(anchor);
    expect(barNode.style.top).to.eq('20px');
    expect(barNode.style.height).to.eq('50px');
  });
});
