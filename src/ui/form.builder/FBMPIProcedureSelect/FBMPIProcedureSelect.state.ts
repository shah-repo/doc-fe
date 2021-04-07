import { observable } from "mobx";
import { FBMPIProcedureSelectValue } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBMPIProcedureSelectState {

  // MARK: @config

  // MARK: @api
  public lotsApi: FBRequest<DocumentRevision[], null> = new FBRequest();
  public useOverrideApi: FBRequest<DocumentRevision, FBMPIProcedureSelectValue> = new FBRequest();

  // MARK: @observables
  @observable public partsAdded?: FBMPIProcedureSelectValue;

  // MARK: @constructor
  public constructor(id?: string) {
    if (!id) { return; }
    this.fetchLotsToPart(id);
  }

  // MARK: @actions

  // MARK: @helpers
  public fetchLotsToPart = (id: string) => this.lotsApi.set({
    url: FBEndpoint.LotsToPart,
    urlValues: { id },
    method: "get",
  });

  public useOverride = (id: string, body: FBMPIProcedureSelectValue) => this.useOverrideApi.set({
    url: FBEndpoint.UseOverride,
    urlValues: { id },
    method: "post",
    body,
  });
}

export default FBMPIProcedureSelectState;
