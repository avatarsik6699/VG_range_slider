import { JSDOM } from 'jsdom';
import { expect } from 'chai'
import { Settings } from './Settings';
import { Handle } from '../Handle/Handle';

const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>')
const document = DOM.window.document;
const defaultState = {
	max: 500,
	min: 10,
  value: [50],
  step: 5,
  position: 'horizontal',
  type: 'single',
  scale: true,
  tooltip: true,
  bar: true,
}

describe('Settings', () => {
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

  it('Должен отрисоваться при начальной инициализации', () => {
    const settings = new Settings(anchor, defaultState);
    const settingsNode = document.querySelector('.settings');
    expect(settingsNode?.matches('.settings')).to.be.true;
  })

  it('(setTemplate) выбрасывает исключение, если params пустой', () => {
    const settings = new Settings(anchor, defaultState);
    //@ts-ignore
    expect(() => settings.setTemplate({})).to.throw()
  })

  it('(getName) возвращает имя класса в нижнем регистре', () => {
    const settings = new Settings(anchor, defaultState);

    expect(settings.getName()).to.equal('settings')
  })

  it('(getNode) выбрасывает исключение, если DOM узел не найден', () => {
    const settings = new Settings(anchor, defaultState);
    anchor.querySelector('.settings')?.remove();

    expect(() => settings.getNode(anchor)).to.throw(`Settings wasn't found`);
  })

  it('(render) выбрасывает исключение, если в renderData отсутствует type', () => {
    const settings = new Settings(anchor, defaultState);
    //@ts-ignore
    expect(() => settings.render(anchor, {})).to.throw('type wasn\'t found');
  })

  it('(_disableField) должен выставить disabled = true у input[name="to"]', () => {
    const settings = new Settings(anchor, defaultState);
    //@ts-ignore
    settings._disableField('to', anchor);
    const fieldTo = document.querySelector(`.settings__value[name="to"]`) as HTMLInputElement;
    expect(fieldTo.disabled).to.be.true;
  })

  it('(_getHandlesValue) возвращает value бегунка с data-id=0', () => {
    const settings = new Settings(anchor, defaultState);
    const handle = new Handle(anchor, defaultState, 0);
    
    //@ts-ignore
    const handleValue = settings._getHandlesValue(anchor);
    expect(handleValue).to.deep.equal([50]);
  })

  it('(_getHandlesValue) возвращает сортированный массив value бегунков', () => {
    const settings = new Settings(anchor, defaultState);
    const state = {...defaultState, value: [100,50]};
    const firstHandle = new Handle(anchor, state, 0);
    const secondHandle = new Handle(anchor, state, 1);
    
    //@ts-ignore
    const handleValue = settings._getHandlesValue(anchor);
    expect(handleValue).to.deep.equal([50, 100]);
  })

  it('(_setDataInFields) устанавливает в инпуты to и from значения из _getHandlesValue', () => {
    const settings = new Settings(anchor, defaultState);
    const state = {...defaultState, value: [100,50]};
    new Handle(anchor, state, 0);
    new Handle(anchor, state, 1);
    //@ts-ignore
    settings._setDataInFields(anchor, settings._getHandlesValue(anchor))
    const fieldFrom = anchor.querySelector(`.settings__value[name="from"]`) as HTMLInputElement;
    const fieldTo = anchor.querySelector(`.settings__value[name="to"]`) as HTMLInputElement;
    
    expect(fieldFrom.value).to.equal('50');
    expect(fieldTo.value).to.equal('100');
  })

  it('(_setVisualFields) устанавливает в селекты значения, соответствующие state', () => {
    const updateVisualFields = {
      scale: 'false', 
      tooltip: 'false', 
      bar: 'false', 
      type: 'range', 
      position: 'vertical'}
    const settings = new Settings(anchor, defaultState);
    
    //@ts-ignore
    settings._setVisualFields(anchor, updateVisualFields);

    const visualFields = Array.from(anchor.querySelectorAll('.settings select'));
    visualFields.forEach( field => {
      let fieldName = (field as HTMLSelectElement).name;
      let fieldValue = (field as HTMLSelectElement).value;
      expect(fieldValue).to.equal(updateVisualFields[fieldName])
    })
  })
})