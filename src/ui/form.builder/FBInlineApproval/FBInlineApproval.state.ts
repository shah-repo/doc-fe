import { action, observable, set } from "mobx";
import { FBInlineApprovalMode } from ".";

export class FBInlineApprovalState {
  @observable public mode: FBInlineApprovalMode = "placeholder";

  @action public setMode = (mode: FBInlineApprovalMode) => {
    set(this, "mode", mode);
  };
}

export default FBInlineApprovalState;
