import { action, observable, set } from "mobx";
import { FBLHRBuildConstructor } from "..";

class FBLHRBuildState {
  @observable public disabled?: boolean;
  @observable public value?: string;

  constructor({ value, disabled }: FBLHRBuildConstructor) {
    this.setDisabled(disabled);
    this.setValue(value);
  }

  @action public setDisabled = (disabled?: boolean) => {
    set(this, "disabled", disabled);
  };

  @action public setValue = (value?: string) => {
    set(this, "value", value);
  };
}

export default FBLHRBuildState;
