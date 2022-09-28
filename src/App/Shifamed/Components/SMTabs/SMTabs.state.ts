import { action, observable, set } from "mobx";
import { SMTabsStateProps } from "../../..";

class SMTabsState implements SMTabsStateProps {
  // MARK: @config

  // MARK: @observables
  /**
   * @cfg {number} Index value of the active tab.
   */
  @observable public value = 0;
  @observable public tabID = "";

  // MARK: @constructor

  // MARK: @computed

  // MARK: @actions
  @action public setValue = (value = 0) => {
    set(this, "value", value);
  };

  @action public setTabID = (id) => {
    set(this, "tabID", id);
  };

  // MARK: @helpers

}

export default SMTabsState;
