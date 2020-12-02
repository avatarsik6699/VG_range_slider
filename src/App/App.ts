import { ComponentProps, RenderData, State } from "../Helpers/Interfaces";
import { Observer } from "../Helpers/Observer";
import { FactorySelector } from "./FactorySelector";
import { getDefaultSpecialCoords } from "./templates/getDefaultSpeicalCoords";

export class App extends Observer {
	private componentInstanceList: {} = {};
	private flag = true;
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
			this.notify('finishCreate', {...this._getAppData()});
		}

		reCreate(params: State): void {
			if (!this._isEmpty(this.anchor)) { this.destroy() }
			this.create(params);
		}

		renderUI(renderData: RenderData) {
			Object.values(this.componentInstanceList).forEach( (instance: any) => {
				if (Array.isArray(instance)) {
					instance.forEach((subInstance, id) => subInstance.render(this.anchor, renderData, id))
				} else {
					instance.render(this.anchor, renderData);
				}
			});
		}

		bindEvents(): void {
			const initEvent = (e: MouseEvent | TouchEvent): void => {
				const target = <HTMLElement>e.target;
				const eventName = this._getEventName(target);
				if (!eventName) return;
				this[eventName](e);
			}
			
			this.anchor.addEventListener('mousedown', initEvent);
			this.anchor.addEventListener('touchstart', initEvent);
		}

		getNode<T>(name: string, config?: {allNodes: boolean}): T {
			if (!this.componentInstanceList) this._throwException('First you need to get component instances')
			
			return config?.allNodes
			? this.componentInstanceList[name].map( instance => instance.getNode(this.anchor))
			: this.componentInstanceList[name][0].getNode(this.anchor)
		}

		getCoord(elemName: string | HTMLElement, coord: string | string[]) {
			const elem = typeof elemName === 'string' 
			? <HTMLElement>this.getNode(elemName)
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
				return this._throwException('incorrect coord or elemName')
			}
		}

		getSpecialCoord(coord: string | (() => number)): number | number[] {
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

		private _settingsEvent(e) {
			const target = e.target;
			const settings: HTMLFormElement = this.getNode('settings');
			if (!settings) throw new Error('Settings not found');

			const settingsData: any = {};
			const getSettingsData = (e: Event) => {
				
				Array.from(settings.elements).forEach( el => {
					let value: unknown = (<HTMLInputElement | HTMLSelectElement>el).value
					let name: string = (<HTMLInputElement | HTMLSelectElement>el).name
					settingsData[name] = isNaN(<number>value)
					? value
					: Number(value)
				}) 
				
				const values = settingsData.type === 'single'
				? ['from']
				: ['from', 'to']

				settingsData.value = values.map( field => {
					let valueNum = settingsData[field];
					delete settingsData[field];
					return valueNum;
				});
				
				this.flag = true;
				console.log(settingsData);
				target.removeEventListener('blur', getSettingsData);
				this.notify('settingsEvent', settingsData);
				// target.removeEventListener('change', getSettings);
			}

			if (target.nodeName === 'INPUT' || target.nodeName === 'SELECT') {
				if (this.flag) {
					this.flag = false
					target.addEventListener('blur', getSettingsData, {once: true});
				} else {
					return
				}
				
				// target.addEventListener('change', getSettings);
			}
		}

		private _sliderEvent(e: MouseEvent| TouchEvent) {
			const target = <HTMLElement>e.target;
			if (target.closest(`[data-component="scale"]`)) {
				this._scaleEvent(e);
			} else {
				const appData = this._getAppData(e);
				let handlesPxValues = this._getHandlesPxValues(e, appData.id)
				this.notify('touchEvent', {pxValue: handlesPxValues, ...appData})

				const handleMove = (e: MouseEvent| TouchEvent): void => {
					handlesPxValues = this._getHandlesPxValues(e,appData.id)
					this.notify('moveEvent',  {pxValue: handlesPxValues, ...appData})
				}
	
				const finishMove = (): void => {
					document.removeEventListener('mousemove', handleMove);
					document.removeEventListener('mouseup', finishMove);
					document.removeEventListener('touchmove', handleMove);
					document.removeEventListener('touchend', finishMove);
				}
				
				if (e instanceof TouchEvent) {
					e.preventDefault();
					document.addEventListener('touchmove', handleMove);
					document.addEventListener('touchend', finishMove);
				} else {
					e.preventDefault();
					document.addEventListener('mousemove', handleMove);
					document.addEventListener('mouseup', finishMove);
				}
	
				(this.componentInstanceList['handle'] as HTMLElement[]).forEach( handle => {
					handle.ondragstart = () => false;
				});
			}
		}

		private _scaleEvent(e: MouseEvent | TouchEvent) {
			const appData = this._getAppData(e);
			const scaleValue = Number((<HTMLElement>e.target)?.textContent);
			const handlesValue = (<HTMLElement[]>this.getNode('handle', {allNodes: true}))
			.map( handle => Number(handle.dataset.value))
			
			// меняем value по id у того handle, который должен переместиться
			handlesValue.splice(appData.id, 1, scaleValue);

			this.notify('scaleEvent', {value: handlesValue, ...appData})
		}

		private _getAppData(e?: MouseEvent | TouchEvent) {
			const id = !e 
			? 0
			: this._defineCloseHandle(this._getCursorPxValue(e));
			const limit = this.getSpecialCoord('limit');
			const handleSize = <number>this.getSpecialCoord('handleSize');
			return {id, limit, handleSize}
		}

		private _getHandlesPxValues(e: MouseEvent | TouchEvent, id: number): number[] {
			const handles = <HTMLElement[]>this.getNode('handle', {allNodes: true});
			const pxValue = Math.round(this._getCursorPxValue(e));
			const sliderTop = this.getCoord('slider', 'top');
			const halfHandleSize = <number>this.getSpecialCoord('handleSize') / 2;

			const handlesPxValue = handles.map( handle => {
				return this.params.position === 'horizontal'
				? Math.round(this.getCoord(handle, 'left') - halfHandleSize)
				: Math.round(Math.abs(sliderTop - this.getCoord(handle, 'top')))
			})

			// меняем value по id у того handle, который должен переместиться
			handlesPxValue.splice(id,1,pxValue);
			return handlesPxValue
		}

		private _getCursorPxValue(e: MouseEvent| TouchEvent) {
			const sliderCoord = this.getCoord('slider', ['top', 'left']);
			const halfHandleSize = <number>this.getSpecialCoord('handleSize') / 2;
			
			const clientX = e instanceof  TouchEvent 
			? e.touches[0].clientX
			: e.clientX

			const clientY = e instanceof  TouchEvent 
			? e.touches[0].clientY
			: e.clientY

			return this.params.position === 'horizontal'
			? clientX - sliderCoord['left'] - halfHandleSize	
			: clientY - sliderCoord['top'] - halfHandleSize
		}

		private _defineCloseHandle(pxValue): number {
			const handles: HTMLElement[] = this.getNode('handle', {allNodes: true});
			const handlesCoord = <number[]>this.getSpecialCoord('handlesCoord');
			const relativeCoords: number[] = handlesCoord.map(
				handleCoord =>  Math.abs(pxValue - handleCoord)
			);
			
			if (relativeCoords.length === 1) {
				return Number(handles[0].dataset.id);
			} else {
				return relativeCoords[0] < relativeCoords[1]
				? Number(handles[0].dataset.id)
				: Number(handles[1].dataset.id)
			}
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