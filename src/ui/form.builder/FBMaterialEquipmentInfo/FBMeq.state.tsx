import { action, observable, set } from "mobx";
import { Document } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBMeqState {
  // MARK: @api
  public getMeqApi = new FBRequest<Document, null>(FBEndpoint.MaterialAndEquipment);
  // MARK @config
  @observable public materialsEquipment: any;
  @action public setMaterialsEquipment = (materialsEquipment) => set(this, "materialsEquipment", materialsEquipment);
  // MARK: @helpers
  public getMeqDetail = (id: string | undefined, clBack) => {
    if (!id) { return; }
    this.getMeqApi.set({
      url: FBEndpoint.MaterialAndEquipment, // MaterialAndEquipment,
      urlValues: { id },
      method: "get",
    }, clBack);
  };
}

export default FBMeqState;
