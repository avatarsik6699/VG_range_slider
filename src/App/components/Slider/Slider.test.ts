import { JSDOM } from 'jsdom';
import { expect } from 'chai'
import { Slider } from './Slider';

const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>')
const document = DOM.window.document;

describe('Slider', () => {
  let anchor: HTMLElement;
  beforeEach(() => {
    anchor = document.querySelector('.anchor') as HTMLElement;
  })

  afterEach(() => {
    anchor.innerHTML = '';
  })

  it('Должен отрисоваться при начальной инициализации', () => {
    new Slider(anchor, {position: 'horizontal'});
    const sliderNode = anchor.querySelector('.slider');
    
    expect(sliderNode?.matches('.slider')).to.be.true;
  })

  it('(getNode) должен вернуть DOM узел', () => {
    const slider = new Slider(anchor, {position: 'horizontal'});
    const sliderNode = slider.getNode(anchor);

    expect(sliderNode.matches('.slider')).to.be.true;
  })

  it('(getNode) выбрасывает исключение, если DOM узел не найден', () => {
    const slider = new Slider(anchor, {position: 'horizontal'});
    anchor.querySelector('.slider')?.remove()
    expect(() => slider.getNode(anchor)).to.throw(`slider wasn't found`);
  })

  it('(getName) возвращает имя в нижнем регистре', () => {
    const slider = new Slider(anchor, {position: 'horizontal'});
    expect(slider.getName()).to.equal('slider');
  })

  it('(getRootElement) должен вернуть родителя', () => {
    const slider = new Slider(anchor, {position: 'horizontal'});
    expect(slider.getRootElement(anchor)).to.equal(anchor);
  })

  it('(setTemplate) выбрасывает ошибку, если нет position в params', () => {
    const slider = new Slider(anchor, {position: 'horizontal'});
    //@ts-ignore
    expect(() => slider.setTemplate({})).to.throw('position wasn\'t found in params');
  })
})