import { hBar, vBar } from "../components/Bar/Bar";
import { hHandle, vHandle } from "../components/Handle/Handle";
import { hScale, vScale } from "../components/Scale/Scale";
import { Settings } from "../components/Settings/Settings";
import { hSlider, vSlider } from "../components/Slider/Slider";
import { hTooltip, vTooltip } from "../components/Tooltip/Tooltip";

const rangeSliderTemplate = (params) => {
  return params.position === 'horizontal'
  ? { slider: hSlider,
      handle: [hHandle, hHandle],
      tooltip: [hTooltip, hTooltip],
      scale: hScale,
      bar: hBar,
      settings: Settings
    }
  : { 
    slider: vSlider,
    handle: [vHandle, vHandle],
    tooltip: [vTooltip, vTooltip],
    scale: vScale,
    bar: vBar,
    settings: Settings
  }
}

export { rangeSliderTemplate }