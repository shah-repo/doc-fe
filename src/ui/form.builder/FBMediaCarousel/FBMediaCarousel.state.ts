import { action, observable, set } from "mobx";

export class FBMediaCarouselState {
  @observable public activeStep = 0;
  @observable public toolsVisibility: "visible" | "hidden" = "hidden";

  @action public setActiveStep = (step: number) => {
    set(this, "activeStep", step);
  };

  @action public setToolsVisible = (state: boolean) => {
    set(this, "toolsVisibility", state ? "visible" : "hidden");
  };
}

export default FBMediaCarouselState;
