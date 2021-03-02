import { action, observable, set } from "mobx";
import { FBWorkspaceMode } from "..";

class FBProcedureDiffState {
  // MARK: @config
  public initialMode: FBWorkspaceMode;

  // MARK: @observables
  @observable checked?: boolean = false;

  // MARK: @constructor
  public constructor(initialMode: FBWorkspaceMode) {
    this.initialMode = initialMode;
  }

  // MARK: @computed

  // MARK: @actions
  @action setChecked = () => set(this, "checked", !this.checked);

  // MARK: @helpers
}

export default FBProcedureDiffState;
