import { action, observable, set } from "mobx";

class FBSwitchPanelState {
  @observable public active = 0;
  @observable public content?: React.ReactNode | string;

  @action public setActive = (step: number) => {
    set(this, "active", step);
  };

  @action public setContent = (content: React.ReactNode | string) => {
    set(this, "content", content);
  };
}

export default FBSwitchPanelState;
