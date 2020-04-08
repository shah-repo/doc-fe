import { action, observable, set } from "mobx";
import { FBInlineApprovalMode } from ".";
import { FBFieldWrapperState } from "../FBFieldWrapper";

export class FBInlineApprovalState extends FBFieldWrapperState {
  @observable public mode: FBInlineApprovalMode = "placeholder";

  @action public setMode = (mode: FBInlineApprovalMode) => {
    set(this, "mode", mode);
  };
}

export default FBInlineApprovalState;
