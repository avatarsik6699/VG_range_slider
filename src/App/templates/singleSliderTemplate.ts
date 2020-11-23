import { hBar, vBar } from "../components/Bar/Bar";
import { hHandle, vHandle } from "../components/Handle/Handle";
import { hScale, vScale } from "../components/Scale/Scale";
import { Settings } from "../components/Settings/Settings";
import { hSlider, vSlider } from "../components/Slider/Slider";
import { hTooltip, vTooltip } from "../components/Tooltip/Tooltip";

const singleSliderTemplate = (params) => {
  return params.position === 'horizontal'
  ? { slider: hSlider,
      handle: [hHandle],
      tooltip: [hTooltip],
      scale: hScale,
      bar: hBar,
      settings: Settings
    }
  : { 
    slider: vSlider,
    handle: [vHandle],
    tooltip: [vTooltip],
    scale: vScale,
    bar: vBar,
    settings: Settings
  }
}

export { singleSliderTemplate }