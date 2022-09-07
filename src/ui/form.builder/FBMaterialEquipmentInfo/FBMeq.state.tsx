import { Document } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBMeqState {
  getMeqApi = new FBRequest<Document, null>(FBEndpoint.MaterialAndEquipment);

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
