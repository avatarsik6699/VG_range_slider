import { throws } from "assert";
import { ComponentProps, State } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { FactorySelector } from "./FactorySelector";
import { getDefaultSpecialCoords } from "./templates/getDefaultSpeicalCoords";

export class App extends Observer {
	private componentInstanceList: {} = {};
	constructor(
		public anchor: HTMLElement, 
		public params: State, 
		private factorySelector: FactorySelector) 
		{
			super();
		}

		create(params: State): void {
			this.params = params; //update params
			this._createComponents(params);
			const sliderCoords = this._getCoord('slider', ['top', 'width']);
			const limit = this._getSpecialCoord('limit');
			const handleSize = this._getSpecialCoord('handleSize');
			this.notify('finishCreate', {slider: sliderCoords, limit, handleSize});
		}

		reCreate(params: State): void {
			if (!this._isEmpty(this.anchor)) { this.destroy() }
			this.create(params);
		}

		renderUI(renderData) {
			Object.values(this.componentInstanceList).forEach( (instance: any) => {
				if (Array.isArray(instance)) {
					instance.forEach((subInstance, id) => subInstance.render(this.anchor, renderData, id))
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
			if (e.target.closest(`[data-component="scale"]`)) {
				this._scaleEvent(e);
				return;
			}

			e.preventDefault();
			const sliderCoord = this._getCoord('slider', ['top', 'width']);
			const limit = this._getSpecialCoord('limit');
			let pxValue = this._getPxValue(e);
			// let id: number | undefined = this.defineCloseHandle(pxValue);
			// this.notify('touchEvent', {pxValue, id, ...{slider: sliderCoord, limit}})
			

			const handleMove = (e: MouseEvent): void => {
				pxValue = this._getPxValue(e);
				// this.notify('moveEvent',  {pxValue, id, ...{slider: sliderCoord, limit}})
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
			const id = this._defineCloseHandle(this._getPxValue(e));
			const limit = this._getSpecialCoord('limit');
			const handleSize = this._getSpecialCoord('handleSize');
			const scaleValue = Number(e.target.textContent);

			const handlesValue = (<HTMLElement[]>this._getComponentNode('handle', {allNodes: true}))
			.map( handle => Number(handle.dataset.value))
			
			handlesValue.splice(id,1,scaleValue);
			// console.log({value: handlesValue, limit, handleSize})
			this.notify('scaleEvent', {value: handlesValue, limit, handleSize, id})
		}

		private _getPxValue(e: MouseEvent) {
			const sliderCoord = this._getCoord('slider', ['top', 'left']);
			const halfHandle = this._getSpecialCoord('handleSize') / 2;
			return this.params.position === 'horizontal'
			? e.clientX - sliderCoord['left'] - halfHandle	
			: e.clientY - sliderCoord['top'] - halfHandle
		}

		private _getEventName(target: HTMLElement | Element| undefined): string | undefined {
			if (!target) this._throwException("Не передан target") 

			const eventName = ['slider', 'settings'].find( name => {
				if (target.closest(`[data-component="${name}"]`)) return name;
			});
			
			return !eventName
			? eventName
			:	`_${eventName}Event`
		}

		private _getComponentNode(name: string, config?: {allNodes: boolean}): HTMLElement | HTMLElement[] {
			if (!this.componentInstanceList) this._throwException('First you need to get component instances')
			
			return config?.allNodes
			? this.componentInstanceList[name].map( instance => instance.getNode(this.anchor))
			: this.componentInstanceList[name][0].getNode(this.anchor)
		}

		private _defineCloseHandle(pxValue): number {
			const handles = this._getComponentNode('handle', {allNodes: true})
			if (!handles) this._throwException('handles not found');
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
			const sliderTop = this._getCoord('slider', 'top');
			const halfHandleSize = this._getSpecialCoord('handleSize') / 2;

			return this.params.position === 'horizontal'
			? handles.map( handle => {
				let left = this._getCoord(handle, 'left');
				return left + halfHandleSize
			})
			: handles.map( handle => {
				let handleTop = this._getCoord(handle, 'top');
				return Math.abs(sliderTop - handleTop) + halfHandleSize;
			})
		}

		private _getCoord(elemName: string, coord: string | string[]) {
			const elem = typeof elemName === 'string' 
			? <HTMLElement>this._getComponentNode(elemName)
			: elemName;

			if (typeof coord === 'string') {
				return elem.getBoundingClientRect()[coord];
			} else if (Array.isArray(coord)) {
				const coords = {}
				coord.forEach( coordName => {
					coords[coordName] = elem.getBoundingClientRect()[coordName]
				})
				return coords;
			} else {
				return this._throwException('incorrect coord')
			}
		}

		private _getSpecialCoord(coord: string | (() => number)): number {
			const defaultSpeicalCoords = getDefaultSpecialCoords.call(this);
			if (typeof coord === 'string' && defaultSpeicalCoords[coord]) {
				return defaultSpeicalCoords[coord]();
			} else if (typeof coord === 'function') {
				return coord();
			} else {
				this._throwException(`${coord} was not found in defaultCoords or incorrect function`)
			}
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

		private _createComponents(params: State): void {
			this.componentInstanceList = this.factorySelector
			.getFactory(params.position)
			.createComponents(this.anchor, params);
		}

		private _isEmpty<T extends HTMLElement>(elem: T) {
			return elem.children.length === 0;
		}

		private _throwException(message: string): never {
			throw new Error(message);
		}
}