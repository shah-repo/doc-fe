import { template } from "lodash";
import { observable, set } from "mobx";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBProcedureFormState {
  public getLotsToPart: FBRequest<Document, null> = new FBRequest(FBEndpoint.LotsToPart);
  public getPartsOfLot: FBRequest<Document, null> = new FBRequest(FBEndpoint.PartsOfLot);
  public getLots: FBRequest<Document, null> = new FBRequest(FBEndpoint.Lots);
  public getParts: FBRequest<Document, null> = new FBRequest(FBEndpoint.Parts);

  // MARK: @observables
  @observable public lotsToPart: DocumentRevision[] = [];
  @observable public partsOfLot: DocumentRevision[] = [];

  // MARK: @config

  // MARK: @constructor

  // MARK: @actions
  public fetchLotsToPart = async (id?: string) => {
    if (!id) { return; }
    const urlTpl = template(FBEndpoint.LotsToPart);
    const url = urlTpl({ id });
    this.getLotsToPart.setUrl(url);
    this.getLotsToPart.fetch();
    const data = await this.getLotsToPart.fetch();
    set(this, "lotsToPart", data);
  };

  public fetchPartsOfLot = async (id?: string) => {
    if (!id) { return; }
    const urlTpl = template(FBEndpoint.PartsOfLot);
    const url = urlTpl({ id });
    this.getPartsOfLot.setUrl(url);
    this.getPartsOfLot.fetch();
    const data = await this.getPartsOfLot.fetch();
    set(this, "partsOfLot", data);
  };

  public fetchLot = async () => {
    const urlTpl = template(FBEndpoint.Lots);
    const url = urlTpl();
    this.getLots.setUrl(url);
    this.getLots.fetch();
    const data = await this.getLots.fetch();
    set(this, "lotsToPart", data);
  };

  public fetchParts = async () => {
    const urlTpl = template(FBEndpoint.Parts);
    const url = urlTpl();
    this.getParts.setUrl(url);
    this.getParts.fetch();
    const data = await this.getParts.fetch();
    set(this, "partsOfLot", data);
  };
  // MARK: @helpers
}

export default FBProcedureFormState;
