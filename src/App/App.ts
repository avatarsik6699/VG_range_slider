import { ComponentProps, State } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { FactorySelector } from "./FactorySelector";

export class App extends Observer {
	private componentInstanceList: {} = {};
	constructor(
		private anchor: HTMLElement, 
		private params: State, 
		private factorySelector: FactorySelector) 
		{
			super();
		}

		create(params: State): void {
			this.params = params;
			this._createComponents(params);
			const componentProps = this._getComponentProps(params);
			this.notify('finishCreate', componentProps);
		}

		reCreate(params: State): void {
			if (!this._isEmpty()) { this.destroy() }
			this.create(params);
		}

		renderUI(renderData) {
			Object.values(this.componentInstanceList).forEach( (instance: any) => {
				if (Array.isArray(instance)) {
					instance.forEach((subInstance, id) => {
						subInstance.render(this.anchor, renderData, id);
					})
				} else {
					instance.render(this.anchor, renderData);
				}
			});
		}

		bindEvents(): void {
			this.anchor.addEventListener('mousedown', (e: MouseEvent): void => {
				const target = <HTMLElement>e.target;
				const eventName = this._getEventName(target);
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
			const componentProps = this._getComponentProps(this.params);
			let pxValue = this._getPxValue(e);
			let id: number | undefined = this.defineCloseHandle(pxValue);
			this.notify('touchEvent', {pxValue, id, ...componentProps})
			

			const handleMove = (e: MouseEvent): void => {
				pxValue = this._getPxValue(e);
				this.notify('moveEvent', {pxValue, id, ...componentProps})
			}

			const finishMove = (): void => {
				document.removeEventListener('mousemove', handleMove);
				document.removeEventListener('mouseup', finishMove);
			}
			
			document.addEventListener('mousemove', handleMove);
			document.addEventListener('mouseup', finishMove);
			(this.componentInstanceList['handles'] as HTMLElement[]).forEach( handle => {
				handle.ondragstart = () => false;
			});
		}

		private _scaleEvent(e) {

		}

		private _createComponents(params: State): void {
			this.componentInstanceList = this.factorySelector
			.getFactory(params.position)
			.createComponents(this.anchor, params);
		}

		private _getPxValue(e: MouseEvent) {
			const componentProps = this._getComponentProps(this.params);
			const halfHandle = (<number>componentProps['handleSize']) / 2;
			const top = componentProps.slider['top']
			const left = componentProps.slider['left']
			return this.params.position === 'horizontal'
			? e.clientX - left - halfHandle	
			: e.clientY - top - halfHandle
		}

		private _getEventName(target: HTMLElement | Element| undefined): string {
			if (!target) this._throwException("Не передан target");
			const eventList = ['slider', 'settings'];
			let eventName: string = '';
			eventList.forEach( name => {
				if (target.closest(`[data-component="${name}"]`)) eventName = name;
			});
			
			return !eventName
			? eventName
			:	`_${eventName}Event`
		}

		private _getComponentNode(name: string, config?: {allNodes: boolean}): HTMLElement {
			if (!this.componentInstanceList) this._throwException('First you need to get component instances')
			
			if (config?.allNodes) {
				return this.componentInstanceList[name].map( instance => {
					return instance.getNode(this.anchor);
				}) 
			} else {
				return Array.isArray(this.componentInstanceList[name])
				? this.componentInstanceList[name][0].getNode(this.anchor)
				: this.componentInstanceList[name].getNode(this.anchor)
			}
			
		}

		private defineCloseHandle(pxValue): number | undefined{
			const handles = this._getComponentNode('handles', {allNodes: true})
			const diffBetweenHandles: number[] = this._getDiffBetweenHandles(handles, pxValue);

			if (diffBetweenHandles.length === 1) {
				return Number(handles[0].dataset.id);
			} else {
				return diffBetweenHandles[0] < diffBetweenHandles[1]
				? Number(handles[0].dataset.id)
				: Number(handles[1].dataset.id)
			}
		}

		private _getDiffBetweenHandles(handles, pxValue): number[] {
			const handlesCoord = this._getHandlesCoord(handles);
			return handlesCoord.map(handleCoord => Math.abs(pxValue - handleCoord));
		}

		private _getHandlesCoord(handles): number[] {
			const componentProps = this._getComponentProps(this.params, ['slider','handles']);
			const halfHandleSize = (<number>componentProps['handleSize']) / 2;

			return this.params.position === 'horizontal'
			? handles.map( (handle, id) => {
				let left = componentProps['handles']['left'][id];
				return left + halfHandleSize
			})
			: handles.map( (handle, id) => {
				let sliderTop = componentProps['slider']['top'];
				let handleTop = componentProps['handles']['top'][id];
				return Math.abs(sliderTop - handleTop) + halfHandleSize;
			})
		}

		private _getComponentProps(params: State, customCompList?: string[], customProps?: string[]): ComponentProps {
			const props = customProps ?? ['left', 'right', 'width', 'height', 'top', 'bottom'];
			const componentList = customCompList ?? ['slider'];
			const componentProps = {};
			const specialProps = [
				['handleSize', () => {
					const handle: HTMLElement = this._getComponentNode('handles');
					return params.position === 'vertical'
					? handle.getBoundingClientRect().height
					: handle.getBoundingClientRect().width
				}],
				['limit', () => {
					const slider: HTMLElement = this._getComponentNode('slider');
					return params.position === 'vertical'
					? slider.getBoundingClientRect().height
					: slider.getBoundingClientRect().width
				}]
			];

			// calculation default properties-----------------
			componentList.forEach( name => {
				let node = this._getComponentNode(name);
				componentProps[name] = {};
				props.forEach( prop => componentProps[name][prop] = node.getBoundingClientRect()[prop]);
			})

			// calculation special properties--------------------
			specialProps.forEach( prop => {
				let name = <string>prop[0];
				let func = <(() => number)>prop[1];
				componentProps[name] = func();
			})

			return componentProps;
		}

		private _isEmpty() {
			return this.anchor.children.length === 0;
		}

		private _throwException(message: string): never {
			throw new Error(message);
		}
}