import { Dictionary, isEmpty, template } from "lodash";
import { observable, set } from "mobx";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBProcedureFormState {
  public getLotsToPart: FBRequest<DocumentRevision[], null> = new FBRequest(FBEndpoint.LotsToPart);
  public getPartsOfLot: FBRequest<DocumentRevision[], null> = new FBRequest(FBEndpoint.PartsOfLot);
  public getLots: FBRequest<DocumentRevision[], null> = new FBRequest(FBEndpoint.Lots);
  public getParts: FBRequest<DocumentRevision[], null> = new FBRequest(FBEndpoint.Parts);
  public initialValues: Dictionary<any> = {};

  // MARK: @observables
  @observable public lotsToPart: DocumentRevision[] | undefined = undefined;
  @observable public partsOfLot: DocumentRevision[] | undefined = undefined;
  @observable public defaultParts: DocumentRevision[] = [];

  // MARK: @config

  // MARK: @constructor
  public constructor({ initialValues }) {
    this.initialValues = initialValues;
    if (!this.partsOfLot) {
      this.fetchParts(true);
    }
    if (!this.lotsToPart && !initialValues?.partLot) {
      this.fetchLots();
    }
  }

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

  public fetchLots = async () => {
    const urlTpl = template(FBEndpoint.Lots);
    const url = urlTpl();
    this.getLots.setUrl(url);
    this.getLots.fetch();
    const data = await this.getLots.fetch();
    set(this, "lotsToPart", data);
  };

  public fetchParts = async (defaultParts?: boolean) => {
    const urlTpl = template(FBEndpoint.Parts);
    const url = urlTpl();
    this.getParts.setUrl(url);
    this.getParts.fetch();
    const data = await this.getParts.fetch();
    if (!defaultParts) {
      set(this, "partsOfLot", data);
    }
    set(this, "partsOfLot", data);
    set(this, "defaultParts", data);
    if (this.initialValues?.partLot) {
      this.fetchPartsOfLot(this.initialValues?.partLot);
    }
    if (this.initialValues?.title) {
      // if not free Solo
      if (!isEmpty(this.defaultParts.filter((e) => e.id === this.initialValues?.title))) {
        this.fetchLotsToPart(this.initialValues?.title);
        return;
      }
      this.fetchLots();
    }
  };

  // MARK: @helpers
}

export default FBProcedureFormState;
