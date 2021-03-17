import { action, observable } from "mobx";
import { FBProcedureValue } from "..";
import FBProcedureState from "../FBProcedure/FBProcedure.state";

export default class FBMPIProcedureState extends FBProcedureState {
  // MARK: @config

  // MARK: @observables
  @observable public selectState = new Map<number, boolean>();

  // MARK: @constructor
  public constructor(value?: FBProcedureValue) {
    super();
    this.value = value;
  }

  // MARK: @computed

  // MARK: @actions
  @action public setSelectState = (index) => {
    this.selectState.set(index, !this.selectState.get(index));
  };

  // MARK: @helpers
}
