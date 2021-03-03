import { action, observable, set } from "mobx";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { AvailableMaintenanceForm } from "./FBEQMaintenance.types";

export class FBEQMaintenanceState {
  // MARK: @observables
  @observable public newPMDisabled?: boolean;

  public availableMaintenanceFormsApi: FBRequest<AvailableMaintenanceForm[], null> = new FBRequest();

  // MARK: @actions
  @action public setNewPMDisabled = (disabled?: boolean) =>
    set(this, "newPMDisabled", disabled);

  public getAvailableMaintenanceForms = () => this.availableMaintenanceFormsApi.set({
    url: FBEndpoint.FecthAvailableMaintenanceForms,
    method: "get",
  });
}

export default FBEQMaintenanceState;
