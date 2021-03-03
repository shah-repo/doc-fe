import { action, observable, set } from "mobx";
import { FBVisibilityType } from "..";

class FBMediaCarouselState {
  @observable public toolsVisibility: FBVisibilityType= "hidden";

  @action public setActiveStep = (step: number) => {
    set(this, "activeStep", step);
  };

  @action public setToolsVisible = (state: boolean) => {
    set(this, "toolsVisibility", state ? "visible" : "hidden");
  };
}

export default FBMediaCarouselState;
