import { Component, State } from "../../../Helpers/Interfaces";

abstract class Bar {
  protected template: string = '';
  protected isInit = false;
  constructor(anchor: Element | HTMLElement, params: State) {
    this.create(anchor, params);
  }

  create(anchor: Element | HTMLElement, params: State): this { 
    this.setTemplate(params);
    const root = this.getRootElement(anchor);
    root.insertAdjacentHTML('beforeend', this.template);
    return this;
  }

  getName(): string {
    return Object.getPrototypeOf(this).constructor.name.slice(1);
  }

  getNode(anchor: HTMLElement | Element): Element {
    if (!anchor) throw new Error(`didn't get anchor`);
    let node = anchor.querySelector('.slider__bar');
    if (!node) throw new Error(`bar wasn't found. Also, for this to work, you must call the 'render' method`);
    return node;
  }

  abstract update(anchor: Element | HTMLElement, renderParams: {pxValue: number} | any): void
  
  protected setTemplate (params: State): void {
    const modifer = `slider__bar_position-${params.position}`
    this.template = `<div class="slider__bar ${modifer}" data-component="bar"></div>`;
  }

  protected getRootElement(anchor: Element): Element {
    const root = anchor.querySelector('.slider');
    if (!root) throw new Error (`root 'Slider' wasn't found`);
    return root;
  }

  protected getHandlesPosition(anchor, position): number[] {
    const handles: HTMLElement[] = anchor.querySelectorAll('.slider__handle');
    const slider = this.getRootElement(anchor);

    let firstTopCoord = Math.abs(handles[0].getBoundingClientRect().top - slider.getBoundingClientRect().top);
    let secondTopCoord = Math.abs(handles[1].getBoundingClientRect().top - slider.getBoundingClientRect().top);

    if (position === 'horizontal') {
        return [
        handles[0].getBoundingClientRect().left - handles[1].getBoundingClientRect().left,
        handles[1].getBoundingClientRect().left - handles[0].getBoundingClientRect().left
      ]
    } else {
      return [
        firstTopCoord - secondTopCoord,
        secondTopCoord - firstTopCoord
      ]
    }
  }

  protected getPxValue(renderData) {
    
    if (renderData.type === 'single') {
      return renderData[0]?.pxValue;
    } else {
      return [renderData[0]?.pxValue, renderData[1]?.pxValue]
    }
  }
}

class hBar extends Bar {
  update(anchor: Element | HTMLElement, renderData: any): void {
    const bar = (<HTMLElement>this.getNode(anchor));
    if (renderData.type === 'single') {
      let pxValue = this.getPxValue(renderData);
      bar.style.left = 0 + 'px';
      bar.style.width = pxValue + 20 + 'px';
    } 

    if(renderData.type === 'range') {
      let pxValue: number[] = this.getPxValue(renderData);
      
      if (!this.isInit) {
        bar.style.width = Math.abs(pxValue[0] - pxValue[1]) + 20 +'px';
        bar.style.left = pxValue[0] < pxValue[1]
        ? pxValue[0] + 'px'
        : pxValue[1] + 'px' 

        this.isInit = true;
      } else {
        const handlesPosition = this.getHandlesPosition(anchor, renderData.position);
        const id = renderData.id;
        const pxValue = renderData[id]?.pxValue ?? 0;
        
        if(handlesPosition[id] <= 0 || handlesPosition[id] === 0) {
          bar.style.left = pxValue + 'px';
          bar.style.width = Math.abs(handlesPosition[id]) + 20 + 'px';
        } else {
          bar.style.width = Math.abs(handlesPosition[id]) + 20 + 'px';
          bar.style.left = pxValue - Math.abs(handlesPosition[id]) + 'px';
        }
      }
    }
  }
}

class vBar extends Bar {
  update(anchor: Element | HTMLElement, renderData: any): void {
    const bar = (<HTMLElement>this.getNode(anchor));
    if (renderData.type === 'single') {
      let pxValue = this.getPxValue(renderData);
      bar.style.top = 0 + 'px';
      bar.style.height = pxValue + 20 + 'px';
    }
    
    if(renderData.type === 'range') {
      let pxValue: number[] = this.getPxValue(renderData);
      
      if (!this.isInit) {
        bar.style.height = Math.abs(pxValue[0] - pxValue[1]) + 20 +'px';
        bar.style.top = pxValue[0] < pxValue[1]
        ? pxValue[0] + 'px'
        : pxValue[1] + 'px' 

        this.isInit = true;
      } else {
        let handlesPosition = this.getHandlesPosition(anchor, renderData.position);
        const id = renderData.id;
        const pxValue = renderData[id]?.pxValue ?? 0;
        if(handlesPosition[id] <= 0 || handlesPosition[id] === 0) {
          bar.style.top = pxValue + 'px';
          bar.style.height = Math.round(Math.abs(handlesPosition[id])) + 20  + 'px';
        } else {
          bar.style.height = Math.abs(handlesPosition[id])  + 20 + 'px';
          bar.style.top = pxValue - Math.abs(handlesPosition[id]) + 'px';
        }
      }
    }
  }
}

export { hBar, vBar };