import { component } from "./components/component_interface";
import { factory } from "./factories/factory_interface";
import { HorizontalSlider } from "./factories/horizontalSlider";
import { VerticalSlider } from "./factories/VerticalSlider";
import { Selector } from "./Selector";
import { sliderTemplate } from './templates/sliderTemplate';

class App {
	private sliderComponents: component[] | undefined = [];
	public selector: Selector = new Selector();
	private factory: HorizontalSlider | VerticalSlider | undefined = undefined;
	private sliderTemplate: any = sliderTemplate;
  constructor(
		public anchor: Element | null, 
		public options: {position: string}) 
		{
			this.setFactory(this.options.position)
			this.setSliderComponents();
			this.renderUI();
			this.bindEvents();
		}

		renderUI(): void {
			this.renderSlider();
			// this.renderSettings();
		}
		
		private setSliderComponents(): void {
			this.sliderComponents = this.factory?.createComponents();
		}

		private setFactory(position: string): void {
			this.factory = this.selector.getFactory(position)
		}

		private renderSlider(): void {
			this.sliderTemplate.render(this.anchor);
			const slider: Element = this.sliderTemplate.getTemplate(this.anchor);

			this.sliderComponents?.forEach( component => {
				component.paint(slider);
			})
		}

		bindEvents(): void {
			this.anchor?.addEventListener('mousedown', e => {
				console.log((<HTMLElement>e.target).dataset.component);
			})
		}

		private renderSettings(): void {

		}
}

// anchor comes from controller ?
// params comes from model in the from 'state' -> there must be an interface
const anchor: Element | null = document.querySelector('.slider-wrapper');
const app = new App(anchor, {
	position: 'horizontal'
})