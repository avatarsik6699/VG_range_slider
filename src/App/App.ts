import { InputType } from "zlib";
import { Component, State } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { Selector } from "./Selector";

export class App extends Observer {
	public componentInstanceList: {} = {};
	public componentNodeList: {[name: string]: HTMLElement | Element | any[]} = {};
	public appData: { [name: string]: any[] | {[key: string]: number} | number} = {};
  constructor(private anchor: HTMLElement, private params: State, private selector: Selector) 
		{
			super();
		}

		init(params: State): void {
			this.params = params;
			if (!this.isEmpty()) {
				this.destroy();
			}

			this.componentInstanceList = this.selector.getFactory(params)!.createComponents(this.anchor, params);
			this.setComponentNodeList();
			this.setAppData(params);
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

		bindEvents(): void {
			this.anchor.addEventListener('mousedown', (e: MouseEvent): void => {
				let target = <HTMLElement>e.target;
				let eventName = this._makeEventName(target);
				if (!eventName) return;
				this[eventName](e);
			})
		}

		show(): void {
			this.anchor.style.display = '';
		}

		hide(): void {
			this.anchor.style.display = 'none';
		}

		destroy(): void {
			Array.from(this.anchor.children).forEach( node => {
				node.remove();
			});
		}

		private _settingsEvent(e) {
			const target = e.target;
			const settings = (document.forms.namedItem('settings'));
			if (!settings) throw new Error('Settings not found');
			const params: any = {};
			const getSettings = (e: Event) => {
				e.preventDefault();
				Array.from(settings?.elements!).forEach( el => {
					let value: unknown  = (<HTMLInputElement | HTMLSelectElement>el).value
					let name: string = (<HTMLInputElement | HTMLSelectElement>el).name
					params[name] = isNaN(<number>value)
					? value
					: Number(value)
				}) 
				
				if (!params.value) {
					params.value = ['from', 'to'].map( field => {
						let valueNum = params[field];
						delete params[field];
						return valueNum;
					}).sort( (a,b) => a - b);
				}

				console.log(params);
				this.notify('settingsEvent', params);
				target.removeEventListener('blur', getSettings);
			}

			if (target.nodeName === 'INPUT' || target.nodeName === 'SELECT') {
				target.addEventListener('blur', getSettings);
			}
		}

		private _sliderEvent(e) {
			// добавить событие со шкалй
			e.preventDefault();
			let pxValue = this._getPxValue(e);
			let id: number | undefined = this.defineCloseHandle(pxValue);
			this.notify('touchEvent', {pxValue, id, ...this.appData})
			this.setAppData(this.params);

			const handleMove = (e: MouseEvent): void => {
				pxValue = this._getPxValue(e);
				this.notify('moveEvent', {pxValue, id, ...this.appData})
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
		}

		private _scaleEvent(e) {

		}

		private _getPxValue(e: MouseEvent) {
			const halfHandle = (<number>this.appData.handleSize) / 2;
			// let top = this.anchor?.querySelector('.slider')!.getBoundingClientRect().top;
			// let left = this.anchor?.querySelector('.slider')!.getBoundingClientRect().left;
			let top = this.appData.slider['top']
			let left = this.appData.slider['left']
			return this.params.position === 'horizontal'
			? e.clientX - left - halfHandle	
			: e.clientY - top - halfHandle
		}

		private _makeEventName(target: HTMLElement | Element| undefined): string {
			if (!target) throw new Error("Не передан target");
			const eventList = ['slider', 'settings'];
			let eventName: string = '';
			eventList.forEach( (name) => {
				if (target.closest(`[data-component="${name}"]`)) {
					eventName = name;
				}
			});

			if (!eventName) {
				return eventName;
			} else {
				return `_${eventName}Event`;
			}
		}

		private setComponentNodeList(): void {
			if (!this.componentInstanceList) throw new Error('First you need to get component instances')
			Object.entries(this.componentInstanceList).forEach( instance => {
				let name = instance[0];
				let node = Array.isArray(instance[1]) 
				? instance[1].map( (subInstance, id) => subInstance.getNode(this.anchor, id))
				: (<Component>instance[1]).getNode(this.anchor)
				this.componentNodeList[name] = node;
			});
		}

		private defineCloseHandle(pxValue): number | undefined{
			
			const handles = (<HTMLElement[]>this.componentNodeList.handles);
			
			let diffHandlesLeft: number[] = this._getDiffHandlesLeft(handles, pxValue);
			if (diffHandlesLeft.length === 1) {
				return Number(handles[0].dataset.id);
			} else {
				return diffHandlesLeft[0] < diffHandlesLeft[1]
				? Number(handles[0].dataset.id)
				: Number(handles[1].dataset.id)
			}
		}

		private _getDiffHandlesLeft(handles, pxValue): number[] {
			
			const handlesLeft = this.params.position === 'horizontal'
			? handles.map( handle => handle.getBoundingClientRect().left + (<number>this.appData.handleSize) / 2)
			: handles.map( handle => {
				return Math.abs(this.appData.slider['top'] - handle.getBoundingClientRect().top) + (<number>this.appData.handleSize) / 2
			})
			
			return handlesLeft.map( number => Math.abs(pxValue - number));
		}

		private setAppData(params: State ): any {
			const props = ['left', 'right', 'width', 'height', 'top', 'bottom'];
			const specialProps = [
				['handleSize', () => {
					return params.position === 'vertical'
					? (<HTMLElement>this.componentNodeList.handles[0]).clientHeight
					: (<HTMLElement>this.componentNodeList.handles[0]).clientWidth
				}],
				['limit', () => {
					return params.position === 'vertical'
					? (<HTMLElement>this.componentNodeList.slider).clientHeight
					: (<HTMLElement>this.componentNodeList.slider).clientWidth
				}]
			];

			Object.entries(this.componentNodeList).forEach( node => {
				let name = node[0];
				let elem = node[1];
				this.appData[name] = {};
				
				// calculation default properties-----------------
				props.forEach( prop => {
					if (Array.isArray(elem)) {
						this.appData[name][prop] = elem.map(subEl => subEl.getBoundingClientRect()[prop])
					} else {
						this.appData[name][prop] = elem.getBoundingClientRect()[prop];
					}
				});
			});

			// calculation special properties--------------------
			specialProps.forEach( prop => {
				let name = <string>prop[0];
				let func = <(() => number)>prop[1];
				this.appData[name] = func();
			})
		}

		private isEmpty() {
			return this.anchor.children.length === 0;
		}
}