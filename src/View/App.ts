import { Observer } from "../Helpers/Observer";
import { component } from "./components/component_interface";
import { factory } from "./factories/factory_interface";
import { HorizontalSlider } from "./factories/horizontalSlider";
import { VerticalSlider } from "./factories/VerticalSlider";
import { Selector } from "./Selector";
import { sliderTemplate } from './templates/sliderTemplate';

class App extends Observer {
	public sliderComponents: component[] | undefined = [];
	public domComponents: any = {};
	public selector: Selector = new Selector();
	private factory: HorizontalSlider | VerticalSlider | undefined = undefined;
	private sliderTemplate: any = sliderTemplate;
  constructor(
		public anchor: Element | null, 
		public options: {position: string}) 
		{
			super();
			this.setFactory(this.options.position)
			this.setSliderComponents();
			this.renderUI();
			this.bindEvents();
			this.setDomComponents();	
		}

		renderUI(): void {
			this.renderSlider();
			// this.renderSettings();
		}
		
		private setSliderComponents(): void {
			this.sliderComponents = this.factory?.createComponents();
		}

		private setDomComponents(): void {
			this.sliderComponents?.forEach( el => {
				let domEl = el.getDomElement(this.anchor);
				let domElName = (<HTMLElement>domEl).dataset.component;
				this.domComponents[domElName!] = domEl;
			});
		}

		private setFactory(position: string): void {
			this.factory = this.selector.getFactory(position)
		}

		private renderSlider(): void {
			this.sliderTemplate.render(this.anchor);
			const slider: Element = this.sliderTemplate.getDomElement(this.anchor);
			this.setDomComponents();

			this.sliderComponents?.forEach( component => {
				component.paint(slider);
			})
		}

		bindEvents(): void {
			this.anchor?.addEventListener('mousedown', e => {
				let targetName = (<HTMLElement>e.target).dataset.component;
				if (targetName === undefined) return;

				let eventName = this.makeEventName(targetName);
				this[eventName](e);
			})
		}

		private makeEventName(name: string): string {
			let upperName = name.toUpperCase().slice(0,1) + name.slice(1);
			return `event${upperName}`;
		}

		private eventBar(e: Event) {
			console.log('bar');
			// this.notify('bar', {});
		}

		private eventHandler(e: any) {
			const handler = (<HTMLElement>e.target);
			const slider = handler.closest('.slider');

			const sliderBorderLeft = Math.round(this.getElementCoords(slider, 'left'));
			const sliderBorderRight = Math.round(this.getElementCoords(slider, 'right'));
			const shiftX = Math.round(e.pageX - this.getElementCoords(handler, 'left'));
			
			const handlerMove = (event) => {
				// this.notify('handler', {
				// 	pageX: event.pageX,
				// 	sliderBorderLeft,
				// 	shiftX,
				// });
				handler.style.left = (event.pageX - sliderBorderLeft) - shiftX + 'px';
			}

			document.addEventListener('mousemove', handlerMove);
			document.onmouseup = () => {
				document.removeEventListener('mousemove', handlerMove);
			};

			(<HTMLElement>e.target).ondragstart = () => false;
			// this.notify('handler', {});
		}

		public getHandlerValue(value: string): string {
			return value;
		}

		private renderSettings(): void {

		}

		private getElementCoords(el: HTMLElement | Element| null, coord: string): any {
			if (!el) return;
			
			return el.getBoundingClientRect()[coord];
		}
}

// anchor comes from controller ?
// params comes from model in the from 'state' -> there must be an interface
const anchor: Element | null = document.querySelector('.slider-wrapper');
const app = new App(anchor, {
	position: 'horizontal'
})