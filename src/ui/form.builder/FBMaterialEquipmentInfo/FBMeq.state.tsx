import { computed } from "mobx";
import { Document } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBMeqState {
  getMeqApi = new FBRequest<Document, null>(FBEndpoint.MaterialAndEquipment);

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
