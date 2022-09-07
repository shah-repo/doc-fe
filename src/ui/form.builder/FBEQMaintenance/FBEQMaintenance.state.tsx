import { action, observable, set } from "mobx";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { AvailableMaintenanceForm } from "..";
import { DOCUMENT_PROPOSED_DOC_ID } from "../../../state/ducks/documents/constants";

class FBEQMaintenanceState {
  // MARK: @observables
  @observable public newPMDisabled?: boolean;

  public availableMaintenanceFormsApi: FBRequest<AvailableMaintenanceForm[], null> = new FBRequest();
  public proposedIdApi: FBRequest<unknown, unknown> = new FBRequest();

  // MARK: @actions
  @action public setNewPMDisabled = (disabled?: boolean) =>
    set(this, "newPMDisabled", disabled);

  public getAvailableMaintenanceForms = () => this.availableMaintenanceFormsApi.set({
    url: FBEndpoint.FecthAvailableMaintenanceForms,
    method: "get",
  });

  public getProposedId = (documentTypeId: string) => {
    this.proposedIdApi.set({
      url: DOCUMENT_PROPOSED_DOC_ID,
      urlValues: {
        documentTypeId,
      },
    });
    return this.proposedIdApi.fetch();
  };
}

export default FBEQMaintenanceState;
