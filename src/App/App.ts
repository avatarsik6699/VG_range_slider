import { Component, State } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { Selector } from "./Selector";

export class App extends Observer {
	public componentInstanceList: {} = {};
	public componentNodeList: {[name: string]: HTMLElement | Element | any[]} = {};
	public appData: { [name: string]: any[] | {[key: string]: number} | number} = {};
  constructor(public anchor: HTMLElement, private state: State, public selector: Selector) 
		{
			super();
		}

		init(state: State): void {
			// this.state = state;
			if (!this.isEmpty()) {this.destroy()};
			this.componentInstanceList = this.selector.getFactory(state)!.createComponents(this.anchor, state);
			this.setComponentNodeList();
			this.setAppData(state);
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
			this.anchor?.addEventListener('mousedown', (e: MouseEvent): void => {
				let target = <Element>e.target;
				if (target.closest('.slider')) {
					e.preventDefault();
					const halfHandle = this.appData.handles['width'][0] / 2;
					let pxValue = this.state.position === 'horizontal'
					? e.clientX - this.appData.slider['left'] - halfHandle
					: e.clientY - this.appData.slider['top'] - halfHandle
					let id: number | undefined = this.defineCloseHandle(pxValue);
					this.notify('touchEvent', {pxValue, id, ...this.appData})

					const handleMove = (e: MouseEvent): void => {
						pxValue = this.state.position === 'horizontal'
						? e.clientX - this.appData.slider['left'] - halfHandle
						: e.clientY - this.appData.slider['top'] - halfHandle
						
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
				} else if (target.closest('.settings')) {
					let settings = (document.forms.namedItem('settings'));
					let labels = Array.from(settings?.elements!)
					let state = {};
					let getState = (e: Event) => {
						e.preventDefault();
						for (let i = 0; i < settings?.elements.length!; i++) {
							if (settings?.elements[i].localName === 'input') {
								let value = (<HTMLInputElement>settings?.elements[i]).value
								let name = (<HTMLInputElement>settings?.elements[i]).name
								state[name] = Number(value);
							}

							if (settings?.elements[i].localName === 'select') {
								let value = (<HTMLInputElement>settings?.elements[i]).value;
								let name = (<HTMLInputElement>settings?.elements[i]).name;
								state[name] = value;
							}
						}
						this.notify('settingsEvent', state);
						target.removeEventListener('blur', getState);
					}

					if (target.nodeName === 'INPUT' || target.nodeName === 'SELECT') {
						target.addEventListener('blur', getState);
					}
				}
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
			let diffHandlesLeft: number[] = [];
			if (this.state.position === 'horizontal') {
				diffHandlesLeft = handles.length >= 2
				? (handles.map( handle => Math.abs(pxValue - handle.getBoundingClientRect().left) ))
				: [(Math.abs(pxValue - handles[0].getBoundingClientRect().left))]
			} else {
				diffHandlesLeft = handles.length >= 2
				? (handles.map( handle => Math.abs(pxValue - handle.getBoundingClientRect().top) ))
				: [(Math.abs(pxValue - handles[0].getBoundingClientRect().top))]
			}
			if (diffHandlesLeft.length === 1) {
				return Number(handles[0].dataset.id);
			} else {
				return +diffHandlesLeft[0] < +diffHandlesLeft[1]
				? Number(handles[0].dataset.id)
				: Number(handles[1].dataset.id)
			}
		}

		private setAppData(state: State ): any {
			const props = ['left', 'right', 'width', 'height', 'top', 'bottom'];
			const specialProps = [
				['limit', () => {
					return state.position === 'vertical'
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