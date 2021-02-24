import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBProcedureFormState {

  // MARK: @config
  public parts?: string[];
  public lots?: string[];

  // MARK: @observables
  public partsApi: FBRequest<DocumentRevision[], null> = new FBRequest();
  public lotsApi: FBRequest<DocumentRevision[], null> = new FBRequest();

  // MARK: @constructor

  // MARK: @actions

  // MARK: @helpers
  public fetchLotsToPart = (id?: string) => {
    this.lotsApi.set({
      url: FBEndpoint.LotsToPart,
      urlValues: { id },
      method: "get",
    });
  };

  public fetchPartsOfLot = (id?: string) => {
    this.partsApi.set({
      url: FBEndpoint.PartsOfLot,
      urlValues: { id },
      method: "get",
    });
  };

  public clearParts = () => (this.parts = []);
  public clearLots = () => (this.lots = []);
  public setParts = (parts: string[]) => (this.parts = parts);
  public setLots = (lots: string[]) => (this.lots = lots);
}

export default FBProcedureFormState;
