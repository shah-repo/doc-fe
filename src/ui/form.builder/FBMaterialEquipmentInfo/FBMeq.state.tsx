import { computed } from "mobx";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { MaterialAndEquipment } from "./FBMaterailEqInfo.types";

class FBMeqState {
  private getMeqApi = new FBRequest<MaterialAndEquipment, null>(FBEndpoint.MaterialAndEquipment);

  public getMeqDetail = (id: string | undefined, callback) => {
    if (!id) { return; }
    this.getMeqApi.set({
      url: FBEndpoint.MaterialAndEquipment,
      urlValues: { id },
      method: "get",
    }, (data, error) => {
      if (error) {
        this.getMeqApi.onError(error);
        return;
      }
      this.getMeqApi.onSuccess();
      callback(data);
    });
  };

  @computed public get loading() {
    return this.getMeqApi.loading;
  }
}

export default FBMeqState;
