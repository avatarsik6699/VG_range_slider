import { Component, State, Template } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { HorizontalSlider } from "./factories/horizontalSlider";
// import { VerticalSlider } from "./factories/VerticalSlider";
import { Selector } from "./Selector";
import {sliderTemplate } from './templates/sliderTemplate';

export class App extends Observer {
	private factory: HorizontalSlider;
	private sliderTemplate: Template = sliderTemplate;
	public componentsDomList: any = {};
	public domComponents: any = {};
  constructor(public anchor: HTMLElement, public params: State, public selector: Selector) 
		{
			super();
			this.factory = selector.getFactory(params)!;
		}

		init(params: State): void {
			this.sliderTemplate.render(this.anchor);
			let components: Component[] = this.factory?.createComponents(params);
			components.forEach( component => {
				component.render(this.anchor, {});
			});
		}

		setFactory(params: State): void {
			this.factory = this.selector.getFactory(params)!;
		}

		// bindEvents(): void {
		// 	this.anchor?.addEventListener('mousedown', (e: MouseEvent) => {
		// 		let component = (<HTMLElement>e.target).dataset.component;
				
		// 		if (!component) return;

		// 		let eventName: 'Slider' | 'Settings' = this.makeEventName(component);
		// 		this[eventName](e);
		// 	})
		// }

		// private makeEventName(name: string): 'Slider' | 'Settings' {
		// 	let upperName = name.toUpperCase().slice(0,1) + name.slice(1);
		// 	return `event${upperName}`;
		// }

		// private eventBar(e: Event) {
		// 	console.log('bar');
		// }

		// private eventHandler(e: any) {
		// 	const handler = (<HTMLElement>e.target);
		// 	const slider = handler.closest('.slider');

		// 	document.addEventListener('mousemove', handlerMove);
		// 	document.onmouseup = () => {
		// 		document.removeEventListener('mousemove', handlerMove);
		// 	};

		// 	(<HTMLElement>e.target).ondragstart = () => false;
		// }
}