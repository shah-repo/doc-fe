import { action, observable, set } from "mobx";

export class FBMediaCarouselState {
  @observable public activeStep = 0;

  @action public setActiveStep = (step: number) => {
    set(this, "activeStep", step);
  };
}

export default FBMediaCarouselState;
