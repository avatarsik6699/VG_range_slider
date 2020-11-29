import { JSDOM } from 'jsdom';
import { expect } from 'chai'
import { App } from '../../App';
import { hScale, vScale } from './Scale';

const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>')
const document = DOM.window.document;

describe('Scale', () => {
  let anchor: HTMLElement;
  let slider: HTMLElement;
  
  beforeEach(() => {
    anchor = document.querySelector('.anchor') as HTMLElement;
    slider = document.createElement('div');
    slider.className = 'slider';

    anchor.insertAdjacentElement('afterbegin', slider);
  })

  afterEach(() => {
    anchor.innerHTML = '';
  })

  it('В начале должен отрисоваться пустым', () => {
    new hScale(anchor, {position: 'horizontal'});
    const scaleNode = document.querySelector('.slider__scale');

    expect(scaleNode?.matches('.slider__scale')).to.be.true;
    expect(scaleNode?.children.length).to.equal(0);
  })

  it('должен возвращать дом узел', () => {
    const scale = new hScale(anchor, {position: 'horizontal'});
    const scaleNode = scale.getNode(anchor);

    expect(scaleNode?.matches('.slider__scale')).to.be.true;
  })

  it('должен возвращать имя в нижнем регистре', () => {
    const scale = new hScale(anchor, {position: 'horizontal'});
    expect(scale.getName()).to.equal('hscale');
  })

  it('выбрасывает ошибку, если не передан position', () => {
    const scale =  new hScale(anchor, {position: 'horizontal'})
    //@ts-ignore
    expect(() => scale.setTemplate({})).to.throw(`position wasn't found in params`);
  })

  it('Должен возвращать в качестве родителя Slider', () => {
    const scale =  new hScale(anchor, {position: 'horizontal'})
    const scaleRoot = scale.getRootElement(anchor);
    
    expect(scaleRoot.matches('.slider')).to.be.true;
  })

  describe('hScale', () => {
    it('Если не передан scaleValues - ошибка', () => {
      const scale = new hScale(anchor, {position: 'horizontal'});
      //@ts-ignore
      expect(() => scale.render(anchor, {})).to.throw('scaleValues not found');
    })
  })

  describe('vScale', () => {
    it('Если не передан scaleValues - ошибка', () => {
      const scale = new vScale(anchor, {position: 'horizontal'});
      //@ts-ignore
      expect(() => scale.render(anchor, {})).to.throw('scaleValues not found');
    })
  })
})