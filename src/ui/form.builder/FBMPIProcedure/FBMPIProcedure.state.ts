import { cloneDeep } from "lodash";
import { action, observable, set } from "mobx";
import { FBMPIProcedureSelectValue, FBProcedureValue } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import FBProcedureState from "../FBProcedure/FBProcedure.state";

export default class FBMPIProcedureState extends FBProcedureState {
  // MARK: @config

  // MARK: @api
  public deleteLotApi: FBRequest<null, null> = new FBRequest();

  // MARK: @observables
  @observable public selectState = new Map<number, boolean>();
  @observable public partsSelected: FBMPIProcedureSelectValue[] = [];

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

  @action addPartsSelected = (part: FBMPIProcedureSelectValue) => {
    const selection = cloneDeep(this.partsSelected);
    selection.push(part);
    set(this, "partsSelected", selection);
  };

  // MARK: @helpers
  public selectionDelete = (id: string, refId: string) => this.deleteLotApi.set({
    url: FBEndpoint.RemoveLot,
    urlValues: { id, refId },
    method: "delete",
  });
}
