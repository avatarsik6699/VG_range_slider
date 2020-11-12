import { Component, State } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { Selector } from "./Selector";

export class App extends Observer {
	public componentInstanceList: {} = {};
	public componentNodeList: {[name: string]: HTMLElement | Element | any[]} = {};
	public appData: { [name: string]: any[] | {[key: string]: number} | number} = {};
  constructor(public anchor: HTMLElement, public params: State, public selector: Selector) 
		{
			super();
		}

		init(params: State): void {
			// сразу создались и добавились в разметку
			this.componentInstanceList = this.selector.getFactory(params)!.createComponents(this.anchor, params);
			this.setComponentNodeList();
			this.setAppData(this.componentNodeList);
			this.notify('finishInit', this.appData);
		}

		renderUI(renderData) {
			Object.values(this.componentInstanceList).forEach( (instance: any) => {
				if (Array.isArray(instance)) {
					instance.forEach( (subInstance, id) => {
						console.log(subInstance);
						subInstance.update(this.anchor, renderData, id);
					} )
				} else {
					instance.update(this.anchor, renderData);
				}
			});
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

		private setComponentNodeList(): void {
			if (!this.componentInstanceList) throw new Error('First you need to get component instances')
			Object.entries(this.componentInstanceList).forEach( instance => {
				let instanceName = instance[0];
				let instanceElement = Array.isArray(instance[1]) 
				? instance[1].map( (subInstance, id) => subInstance.getNode(this.anchor, id))
				: (<Component>instance[1]).getNode(this.anchor)
				this.componentNodeList[instanceName] = instanceElement;
			});
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