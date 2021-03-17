import { action, observable, set } from "mobx";
import { FBFieldWrapperProps } from "..";

class FBFieldWrapperState {
  @observable public toolsVisible: FBFieldWrapperProps["toolsVisible"] = "hidden";
  @observable public addToolVisible: FBFieldWrapperProps["addToolVisible"] = "hidden";
  @observable public markDownVisible = false;
  @observable public state: FBFieldWrapperState | undefined;

  @action public setToolsActive = (active: boolean) => {
    const visibleState: FBFieldWrapperProps["toolsVisible"] = active ? "visible" : "hidden";
    set(this, "toolsVisible", visibleState);
  };

  @action public setAddToolActive = (active: boolean) => {
    const visibleState: FBFieldWrapperProps["addToolVisible"] = active ? "visible" : "hidden";
    set(this, "addToolVisible", visibleState);
  };

  @action public setMarkDownActive = (active: boolean) => {
    set(this, "markDownVisible", active);
  };
}

export default FBFieldWrapperState;
