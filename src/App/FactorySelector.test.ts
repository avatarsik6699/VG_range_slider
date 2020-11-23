import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { FactorySelector } from './FactorySelector';
import { defaultCoreState } from './../Core/defaultCoreState';
import { HorizontalSlider } from './factories/horizontalSlider';
import { VerticalSlider } from './factories/VerticalSlider';

const DOM = new JSDOM('<html><body></body></html>');
const document = DOM.window.document;

const getInstanceFactory = (position) => new FactorySelector().getFactory(position);

describe('FactorySelector', () => {
  let anchor: HTMLElement;
  beforeEach( () => {
    anchor = document.createElement('div');
    anchor.className = 'anchor';
  });

  afterEach( () => {
    anchor.innerHTML = '';
  })

  it('return the correct factory', () => {
    const instanceHS = getInstanceFactory('horizontal');
    const instanceVS = getInstanceFactory('vertical');

    expect(instanceHS).to.be.an.instanceOf(HorizontalSlider)
    expect(instanceVS).to.be.an.instanceOf(VerticalSlider) 
  })

  it('throw mistake if position isn\'t valid', () => {
    const mistakesPosition = [55, true, false, 'mistake', null, undefined, '']
    const factorySelector = new FactorySelector;
    
    mistakesPosition.forEach( mistake => {
      let mistakeFunc = factorySelector.getFactory.bind(factorySelector, <string>mistake)
      expect(mistakeFunc).to.throw();
    })   
  })
})