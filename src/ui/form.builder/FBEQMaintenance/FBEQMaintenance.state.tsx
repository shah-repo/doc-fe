import { action, observable, set } from "mobx";

class FBEQMaintenanceState {
  // MARK: @observables
  @observable public newPMDisabled?: boolean;

  // MARK: @actions
  @action public setNewPMDisabled = (disabled?: boolean) =>
    set(this, "newPMDisabled", disabled);
}

export default FBEQMaintenanceState;
