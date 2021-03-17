import { action, observable, set } from "mobx";
import { FBMPIProcedureSelectValue } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBMPIProcedureSelectState {

  // MARK: @config

  // MARK: @api
  public lotsApi: FBRequest<DocumentRevision[], null> = new FBRequest();
  public useLotApi: FBRequest<null, FBMPIProcedureSelectValue> = new FBRequest();

  // MARK: @observables
  @observable public lotsNumber = 0;

  // MARK: @constructor
  public constructor(id?: string) {
    if (!id) { return; }
    this.fetchLotsToPart(id);
  }

  // MARK: @actions
  @action setLotNumber = () =>
    set(this, "lotsNumber", this.lotsNumber + 1);

  // MARK: @helpers
  public fetchLotsToPart = (id: string) => this.lotsApi.set({
    url: FBEndpoint.LotsToPart,
    urlValues: { id },
    method: "get",
  });

  public useLot = (id: string, body: FBMPIProcedureSelectValue) => this.useLotApi.set({
    url: FBEndpoint.UseLot,
    urlValues: { id },
    method: "post",
    body,
  });
}

export default FBMPIProcedureSelectState;
