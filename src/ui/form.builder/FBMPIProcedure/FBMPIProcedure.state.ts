import { cloneDeep } from "lodash";
import { action, observable, set } from "mobx";
import { FBMPIProcedureSelectValue, FBProcedureItemType, FBProcedureValue } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import FBProcedureState from "../FBProcedure/FBProcedure.state";

export default class FBMPIProcedureState extends FBProcedureState {
  // MARK: @config

  // MARK: @api
  public deleteLotApi: FBRequest<null, null> = new FBRequest();

  // MARK: @observables
  @observable public selectState = new Map<string, boolean>();
  @observable public partsSelected: Partial<FBMPIProcedureSelectValue>[] = [];

  // MARK: @constructor
  public constructor(value?: FBProcedureValue) {
    super();
    this.value = value;
  }

  // MARK: @computed

  // MARK: @actions
  @action public setSelectState = (index: number, type: FBProcedureItemType) => {
    this.selectState.set(`${type}-${index}`, !this.selectState.get(`${type}-${index}`));
  };

  @action addPartsSelected = (part: FBMPIProcedureSelectValue) => {
    const selection = cloneDeep(this.partsSelected);
    selection.push(part);
    set(this, "partsSelected", selection);
  };

  // MARK: @helpers
  public selectionDelete = (id: string, refId: string) => {
    this.deleteLotApi.set({
      url: FBEndpoint.RemoveOverride,
      urlValues: { id, refId },
      method: "post",
    });
  };

  public setPartsSelected = (partsSelected) => set(this, "partsSelected", partsSelected);
}
