import { JSDOM } from 'jsdom';
import { expect } from 'chai'
import { hBar, vBar } from './Bar';

const DOM = new JSDOM('<html><body><div class="anchor"></div></body></html>');
const document = DOM.window.document;

// Общие наследуемые свйоства от абстрактного класса Bar тестируются через hBar
describe('Bar', () => {
  let anchor: HTMLElement;
  let slider: HTMLElement;

    beforeEach( () => {
      anchor = <HTMLElement>document.body.querySelector('.anchor');

      slider = document.createElement('div');
      slider.className = 'slider';

      anchor.insertAdjacentElement('afterbegin', slider);
    })

    afterEach( () => {
      anchor.innerHTML = '';
    })

    it('should throw exception if the position is invalid', () => {
      const invalidPositions = ['',1,true,false];
      const hbar = new hBar(anchor, {position: 'horizontal'});
     
      invalidPositions.forEach( (pos => {
        //@ts-ignore
        expect(() => hbar.setTemplate({position: pos})).to.throw('position wasn\'t found or incorrect');
      }))
    })

    it('should throw exception if the root(slider) not found', () => {
      const hbar = new hBar(anchor, {position: 'horizontal'});
      const slider = document.querySelector('.slider') as HTMLElement;
      slider.remove()

      expect(() => hbar.getRootElement(anchor)).to.throw(`root 'Slider' wasn't found`)
    })

    it('should return name in lowercase', () => {
      const hbar = new hBar(anchor, {position: 'horizontal'});

      expect(hbar.getName()).to.equal('hbar')
    }) 

    it('should throw exception if incorrect renderData', () => {
      const hbar = new hBar(anchor, {position: 'horizontal'});

      //@ts-ignore 
      expect(() => hbar.render(anchor, {})).to.throw('type or handleSize wasn\'t found in renderData')
      //@ts-ignore 
      expect(() => hbar.render(anchor, {type: 'single'})).to.throw('type or handleSize wasn\'t found in renderData')
    })

    it('should throw exception if wasn\'t found pxValue(s)', () => {
      const hbar = new hBar(anchor, {position: 'horizontal'});

      //@ts-ignore 
      expect(() => hbar.getPxValue(anchor, {type: 'single', '0': {} })).to.throw()
      //@ts-ignore 
      expect(() => hbar.getPxValue(anchor, {type: 'range', '0': {}, '1': {}})).to.throw()
    })

  describe('hBar', () => {
    it('should render the single correctly', () => {
      const hbar = new hBar(anchor, {position: 'horizontal'});
      
      
      hbar.render(anchor, {
        //@ts-ignore
        0: {pxValue: 50},
        type: 'single', 
        handleSize: 20, 
      })

      const barNode = hbar.getNode(anchor);
      expect(barNode.style.left).to.eq('0px');
      expect(barNode.style.width).to.eq('70px');
    }) 

    it('should render the range correctly', () => {
      const hbar = new hBar(anchor, {position: 'horizontal'});
      
      hbar.render(anchor, {
        //@ts-ignore
        0: {pxValue: 20},
        //@ts-ignore
        1: {pxValue: 50},
        type: 'range', 
        handleSize: 20, 
      })

      const barNode = hbar.getNode(anchor);
      expect(barNode.style.left).to.eq('20px');
      expect(barNode.style.width).to.eq('50px');
    }) 
  })

  describe('vBar', () => {
    it('should render the single correctly', () => {
      const vbar = new vBar(anchor, {position: 'horizontal'});
      
      
      vbar.render(anchor, {
        //@ts-ignore
        0: {pxValue: 50},
        type: 'single', 
        handleSize: 20, 
      })

      const barNode = vbar.getNode(anchor);
      expect(barNode.style.top).to.eq('0px');
      expect(barNode.style.height).to.eq('70px');
    }) 

    it('should render the range correctly', () => {
      const vbar = new vBar(anchor, {position: 'horizontal'});
      
      vbar.render(anchor, {
        //@ts-ignore
        0: {pxValue: 20},
        //@ts-ignore
        1: {pxValue: 50},
        type: 'range', 
        handleSize: 20, 
      })

      const barNode = vbar.getNode(anchor);
      expect(barNode.style.top).to.eq('20px');
      expect(barNode.style.height).to.eq('50px');
    }) 
  })
})