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
	public componentInstanceList: {} = {};
	public componentNodeList: {[name: string]: HTMLElement | Element | any[]} = {};
	public appData: { [name: string]: any[] | {[key: string]: number} | number} = {};
  constructor(public anchor: HTMLElement, public params: State, public selector: Selector) 
		{
			super();
			this.factory = selector.getFactory(params)!;
		}

		init(params: State): void {
			this.sliderTemplate.render(this.anchor);
			this.componentInstanceList = this.factory?.createComponents(params);
			this.componentNodeList['slider'] = this.sliderTemplate.getNode(this.anchor);
			Object.entries(this.componentInstanceList).forEach( instance => {
				let instanceName = instance[0];
				let instanceElement = Array.isArray(instance[1]) 
				? instance[1].map( (el, index) => el.create(this.anchor).getNode(this.anchor, index))
				: (<Component>instance[1]).create(this.anchor).getNode(this.anchor)
				this.componentNodeList[instanceName] = instanceElement;
			});

			this.setAppData(this.componentNodeList);
			this.notify('finishInit', this.appData);
		}

		renderUI(renderData) {
			Object.values(this.componentInstanceList).forEach( (instance: any) => {
				if (Array.isArray(instance)) {
					instance.forEach( (handle, index) => {
						handle.update(this.anchor, renderData, index);
					} )
				} else {
					instance.update(this.anchor, renderData);
				}
			});
		}

		setFactory(params: State): void {
			this.factory = this.selector.getFactory(params)!;
		}

		setAppData(componentNodeList: {[name: string]: HTMLElement | Element | any[]} = {} ): any {
			const properties = ['left', 'right', 'width'];
			const specialProperties = [
				['halfHandle', () => Math.round( componentNodeList.handles[0].getBoundingClientRect().width / 2)],
			];

			Object.entries(componentNodeList).forEach( el => {
				let nodeName = el[0];
				let nodeElem = el[1];
				this.appData[nodeName] = {};
				
				// calculation default properties-----------------
				properties.forEach( prop => {
					if (Array.isArray(nodeElem) && nodeElem.length > 1) {
						this.appData[nodeName][prop] = 
						[nodeElem[0].getBoundingClientRect()[prop], nodeElem[1].getBoundingClientRect()[prop]];
					} else if (Array.isArray(nodeElem)) {
						this.appData[nodeName][prop] = nodeElem[0].getBoundingClientRect()[prop];
					} else {
						this.appData[nodeName][prop] = nodeElem.getBoundingClientRect()[prop];
					}
				});
			});

			// calculation special properties--------------------
			specialProperties.forEach( prop => {
				let name = <string>prop[0];
				let func = <(() => number)>prop[1];
				this.appData[name] = func();
			})
		}

		bindEvents(): void {
			this.anchor?.addEventListener('mousedown', (e: MouseEvent) => {
				if ((<Element>e.target)?.closest('.slider')) {
					e.preventDefault();
				
					const halfHandle = 10;
					let left = e.clientX - this.appData.slider['left'] - halfHandle;
					let targetId = 0;
					if ((this.componentNodeList.handles as Element[]).length > 1) {
						targetId = this.defineCloseHandle(left);
						this.notify('touchEvent', {left, targetId, ...this.appData})
					} else {
						this.notify('touchEvent', {left, ...this.appData})
					}

					const handleMove = (e: MouseEvent) => {
						left = e.clientX - this.appData.slider['left'] - halfHandle;
						this.notify('moveEvent', {left, targetId, ...this.appData})
					}

					const finishMove = () => {
						document.removeEventListener('mousemove', handleMove);
						document.removeEventListener('mouseup', finishMove);
					}

					document.addEventListener('mousemove', handleMove);
					document.addEventListener('mouseup', finishMove);
					(this.componentNodeList.handles as HTMLElement[]).forEach( handle => {
						handle.ondragstart = () => false;
					});
				};
			})
		}

		private defineCloseHandle(left: any): any {
			let targetId;
			if ((this.componentNodeList.handles as any[]).length > 1)	{
				let targetId = 0;
			} else {
				let firstHandleLeft = this.componentNodeList.handles[0].getBoundingClientRect().left;
				let secondHandleLeft = this.componentNodeList.handles[1].getBoundingClientRect().left;

				
				let firstResult = Math.abs(left - firstHandleLeft);
				let secondResult = Math.abs(left - secondHandleLeft);
				
				let targetId = firstResult < secondResult 
				? this.componentNodeList.handles[0].dataset.id 
				: this.componentNodeList.handles[1].dataset.id 
			}
				

			return targetId;
		}
}