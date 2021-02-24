import { FBProcedureValue } from "..";
import FBProcedureState from "../FBProcedure/FBProcedure.state";

export default class FBMPIProcedureState extends FBProcedureState {
  // MARK: @config

  // MARK: @observables

  // MARK: @constructor
  public constructor(value?: FBProcedureValue) {
    super();
    this.value = value;
  }

  // MARK: @computed

  // MARK: @actions

  // MARK: @helpers
}
