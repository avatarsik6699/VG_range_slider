import { JSDOM } from 'jsdom';
import { expect } from 'chai'
import { App } from '../../App';
import { Scale } from './Scale';

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
    new Scale(anchor, {position: 'horizontal'});
    const scaleNode = document.querySelector('.slider__scale');

    expect(scaleNode?.matches('.slider__scale')).to.be.true;
    expect(scaleNode?.children.length).to.equal(0);
  })

  it('(getNode) должен возвращать дом узел', () => {
    const scale = new Scale(anchor, {position: 'horizontal'});
    const scaleNode = scale.getNode(anchor);

    expect(scaleNode?.matches('.slider__scale')).to.be.true;
  })

  it('(getName) должен возвращать имя в нижнем регистре', () => {
    const scale = new Scale(anchor, {position: 'horizontal'});
    expect(scale.getName()).to.equal('scale');
  })

  it('(setTemplate) выбрасывает ошибку, если не передан position', () => {
    const scale =  new Scale(anchor, {position: 'horizontal'})
    //@ts-ignore
    expect(() => scale._setTemplate({})).to.throw(`position wasn't found in params`);
  })

  it('(getRootElement) Должен возвращать в качестве родителя Slider', () => {
    const scale =  new Scale(anchor, {position: 'horizontal'})
    const scaleRoot = scale.getRootElement(anchor);
    
    expect(scaleRoot.matches('.slider')).to.be.true;
  })

  it('(render) Если не передан scaleValues - ошибка', () => {
    const scale = new Scale(anchor, {position: 'horizontal'});
    //@ts-ignore
    expect(() => scale.render(anchor, {position: 'horizontal'})).to.throw('scaleValues not found');
  })
})