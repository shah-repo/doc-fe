import { action, observable, set } from "mobx";
import { FormFooterStateProps } from "../../..";

export default class FormFooterState implements FormFooterStateProps {

  // MARK: @config

  // MARK: @observables
  @observable public hidden = true;

  // MARK: @api

  // MARK: @constructor

  // MARK: @computed

  // MARK: @actions
  @action setHidden = (hidden: boolean) => {
    set(this, "hidden", hidden);
  };

  // MARK: @helpers
}
