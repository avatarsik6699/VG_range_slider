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
				let target = <Element>e.target;
				if (target.closest('.slider')) {
					e.preventDefault();
					let halfHandle = <number>this.appData.halfHandle;
					let pxValue = this.params.position === 'horizontal'
					? e.clientX - this.appData.slider['left'] - halfHandle
					: e.clientY - this.appData.slider['top'] - halfHandle
					let id: number | undefined = this.defineCloseHandle(pxValue);
					let diffBetweenHandles = this.getDiffBetweenHandles();
					let rangeBetweenHandles = this.getRangeBetweenHandles();
					this.notify('touchEvent', {pxValue, diffBetweenHandles, rangeBetweenHandles, id, ...this.appData})

					const handleMove = (e: MouseEvent): void => {
						diffBetweenHandles = this.getDiffBetweenHandles();
						rangeBetweenHandles = this.getRangeBetweenHandles();
						pxValue = this.params.position === 'horizontal'
						? e.clientX - this.appData.slider['left'] - halfHandle
						: e.clientY - this.appData.slider['top'] - halfHandle
						
						this.notify('moveEvent', {pxValue, diffBetweenHandles, rangeBetweenHandles, id, ...this.appData})
					}

					const finishMove = (): void => {
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

		private defineCloseHandle(pxValue): number | undefined{
			const handles = (<HTMLElement[]>this.componentNodeList.handles);
			
			let diffHandlesLeft: number[] = handles.length >= 2
			? (handles.map( handle => Math.abs(pxValue - handle.getBoundingClientRect().left) ))
			: [(Math.abs(pxValue - handles[0].getBoundingClientRect().left))]

			if (diffHandlesLeft.length === 1) {
				return Number(handles[0].dataset.id);
			} else {
				return +diffHandlesLeft[0] < +diffHandlesLeft[1]
				? Number(handles[0].dataset.id)
				: Number(handles[1].dataset.id)
			}
		}

		private getDiffBetweenHandles(): number[] {
			let handles = (<HTMLElement[]>this.componentNodeList.handles);
			let diffBetweenHandles = [
				handles[0].getBoundingClientRect().left - handles[1].getBoundingClientRect().left,
				handles[1].getBoundingClientRect().left - handles[0].getBoundingClientRect().left
			]
			return diffBetweenHandles;
		}

		private getRangeBetweenHandles(): number {
			let handles = (<HTMLElement[]>this.componentNodeList.handles);
			let diffBetweenHandles = this.getDiffBetweenHandles();
			let result = diffBetweenHandles[0] <= diffBetweenHandles[1] 
			? handles[0].getBoundingClientRect().left - handles[1].getBoundingClientRect().right
			: handles[1].getBoundingClientRect().left - handles[0].getBoundingClientRect().right
			
			return Math.abs(result - 20);	
		}
}