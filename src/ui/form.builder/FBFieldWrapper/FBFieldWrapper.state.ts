import { action, observable, set } from "mobx";
import { FBFieldWrapperProps } from ".";

export class FBFieldWrapperState {
  @observable public toolsVisible: FBFieldWrapperProps["toolsVisible"] = "hidden";
  @observable public markDownVisible: boolean = false;

  @action public setToolsActive = (active: boolean) => {
    const visibleState: FBFieldWrapperProps["toolsVisible"] = active ? "visible" : "hidden";
    set(this, "toolsVisible", visibleState);
  }

  @action public setMarkDownActive = (active: boolean) => {
    set(this, "markDownVisible", active);
  }
}

export default FBFieldWrapperState;
