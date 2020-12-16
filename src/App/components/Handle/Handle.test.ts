import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { Handle } from './Handle';

const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>');
const { document } = DOM.window;

// Общие наследуемые свйоства от абстрактного класса Handle тестируются через Handle
describe('Handle', () => {
  let anchor: HTMLElement;
  let slider: HTMLElement;

  beforeEach(() => {
    anchor = document.querySelector('.anchor') as HTMLElement;
    slider = document.createElement('div');
    slider.className = 'slider';

    anchor.insertAdjacentElement('afterbegin', slider);
  });

  afterEach(() => {
    anchor.innerHTML = '';
  });

  it('При инициализации должен отрисоваться по state', () => {
    new Handle(anchor, { position: 'horizontal', value: [10] }, 0);
    const handle = anchor.querySelector('.slider__handle') as HTMLElement;
    expect(handle.matches('.slider__handle')).to.be.true;
    expect(handle.dataset.id).to.equal('0');
  });

  it('(getNode) должен корректно возвращать DOM элемент', () => {
    const handle = new Handle(anchor, { position: 'horizontal', value: [10] }, 0);
    expect(handle.getNode(anchor).matches('.slider__handle')).to.be.true;
  });

  it('(getNode) выбрасывает ошибку, если DOM элемент не найден', () => {
    const handle = new Handle(anchor, { position: 'horizontal', value: [10] }, 0);
    anchor.innerHTML = '';
    expect(() => handle.getNode(anchor).matches('.slider__handle')).to.throw(`handle wasn't found`);
  });

  it('(getName) возвращает имя класса в нижнем регистре', () => {
    const handle = new Handle(anchor, { position: 'horizontal', value: [10] }, 0);
    expect(handle.getName()).to.equal('handle');
  });

  it('(getRootElement) возвращает родителя если нет - ошибка', () => {
    const handle = new Handle(anchor, { position: 'horizontal', value: [10] }, 0);
    expect(handle.getRootElement(anchor).matches('.slider')).to.be.true;

    document.querySelector('.slider')?.remove();
    expect(() => handle.getRootElement(anchor).matches('.slider')).to.throw("Root wasn't found");
  });

  it('(setTemplate) если некорректно передан params - ошибка', () => {
    const handle = new Handle(anchor, { position: 'horizontal', value: [10] }, 0);
    // @ts-ignore
    expect(() => handle._setTemplate(anchor, {})).to.throw("incorrect params: wasn't found position or value");
  });

  it('(render) должен правильно отрисовать horizontal настройками', () => {
    const handle = new Handle(anchor, { position: 'horizontal', value: [10] }, 0);
    // @ts-ignore
    const renderData = { 0: { pxValue: 10, value: 10 }, position: 'horizontal', type: 'single' };
    // @ts-ignore
    handle.render(anchor, renderData);
    const handleNode = handle.getNode(anchor);
    expect(handleNode.style.left).to.equal('10px');
    expect(handleNode.dataset.value).to.equal('10');
  });

  it('(render) должен правильно отрисовать vertical настройками', () => {
    const handle = new Handle(anchor, { position: 'vertical', value: [10] }, 0);
    const renderData = { 0: { pxValue: 10, value: 10 }, position: 'vertical', type: 'single' };
    // @ts-ignore
    handle.render(anchor, renderData);
    const handleNode = handle.getNode(anchor);
    expect(handleNode.style.top).to.equal('10px');
    expect(handleNode.dataset.value).to.equal('10');
  });
});
