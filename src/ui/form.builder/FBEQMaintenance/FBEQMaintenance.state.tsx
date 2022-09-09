import { action, observable, set } from "mobx";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { AvailableMaintenanceForm } from "..";
import { DOCUMENT_PROPOSED_DOC_ID } from "../../../state/ducks/documents/constants";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types"

class FBEQMaintenanceState {
  @observable public newPMDisabled?: boolean;
  @observable public newPMLoading?: boolean;

  public availableMaintenanceFormsApi: FBRequest<AvailableMaintenanceForm[], null> = new FBRequest();
  public proposedIdApi: FBRequest<null, null> = new FBRequest();
  public maintenanceHistoryApi: FBRequest<Record<string, DocumentRevision[]>, null> = new FBRequest();

  @action public setNewPMDisabled = (value: boolean) => set(this, "newPMDisabled", value);
  @action public setNewPMLoading = (value: boolean) => set(this, "newPMLoading", value);

  public getAvailableMaintenanceForms = () => this.availableMaintenanceFormsApi.set({
    url: FBEndpoint.FecthAvailableMaintenanceForms,
    method: "get",
  });

  public getProposedId = (documentTypeId: string) => {
    this.proposedIdApi.set({
      url: DOCUMENT_PROPOSED_DOC_ID + "?documentTypeId=" + documentTypeId,
    });
    return this.proposedIdApi.fetch();
  };

  public getMaintenanceHistory = (id: string) => {
    this.maintenanceHistoryApi.set({
      url: FBEndpoint.HistoryMaintenance,
      urlValues: { id },
    });
    return this.maintenanceHistoryApi.fetch();
  };
}

export default FBEQMaintenanceState;
