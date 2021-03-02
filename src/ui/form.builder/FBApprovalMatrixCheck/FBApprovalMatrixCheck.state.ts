import { action, observable, set } from "mobx";

class FBApprovalMatrixCheckState  {

  @observable public checked = false;

  public constructor(checked: boolean) {
    this.checked = checked;
  }

  @action public toggle = () => {
    set(this, "checked", !this.checked);
  };

}

export default FBApprovalMatrixCheckState;

