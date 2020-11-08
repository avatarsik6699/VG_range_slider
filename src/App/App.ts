import { Expression } from "typescript";
import { Component, State, Template } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { HorizontalSlider } from "./factories/horizontalSlider";
// import { VerticalSlider } from "./factories/VerticalSlider";
import { Selector } from "./Selector";
import {sliderTemplate } from './templates/sliderTemplate';

export class App extends Observer {
	private factory: HorizontalSlider;
	private sliderTemplate: Template = sliderTemplate;
	public componentInstancesList: Component[] = [];
	public componentNodeList: {[name: string]: HTMLElement | Element} = {};
	public appData: { [name: string]: {[key: string]: number} | number} = {};
  constructor(public anchor: HTMLElement, public params: State, public selector: Selector) 
		{
			super();
			this.factory = selector.getFactory(params)!;
		}

		init(params: State): void {
			this.sliderTemplate.render(this.anchor);
			this.componentInstancesList = this.factory?.createComponents(params);
			this.componentNodeList['Slider'] = this.sliderTemplate.getNode(this.anchor);

			

			this.componentInstancesList.forEach( component => {
				component.render(this.anchor, {});

				let componentName = component.getName();
				let componentNode = component.getNode(this.anchor);
				this.componentNodeList[componentName] = componentNode;
			});
			this.setAppData(this.componentNodeList);
			this.notify('finishInit', this.appData);
		}

		renderUI() {
			
		}

		setFactory(params: State): void {
			this.factory = this.selector.getFactory(params)!;
		}

		setAppData(componentNodeList: {[name: string]: HTMLElement | Element} = {} ): any {
			const exclude = ['Bar', 'Tooltip']; // не нуждаются в вычислениях ?
			const properties = ['left', 'right', 'width'];
			const specialProperties = [
				['shiftX', () => Math.round( (this.appData.Handle['right'] - this.appData.Handle['left']) / 2)],
			];

			Object.entries(componentNodeList).forEach( el => {
				let nodeName = el[0];
				let nodeDom = el[1];
				this.appData[nodeName] = {};
				
				// calculation default properties
				properties.forEach( prop => {
					let propValue = nodeDom.getBoundingClientRect()[prop];
					this.appData[nodeName][prop] = propValue;
				});
			});

			// calculation special properties
			specialProperties.forEach( prop => {
				let name = <string>prop[0];
				let func = <(() => number)>prop[1];
				this.appData[name] = func();
			})
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