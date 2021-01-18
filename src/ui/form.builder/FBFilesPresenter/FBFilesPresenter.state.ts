import { FBAttachment } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBFilesPresenterState {

  public filesApi: FBRequest<FBAttachment[], null> = new FBRequest();

  public getFiles = (ids: string[]) => this.filesApi.set({
    url: FBEndpoint.AttachmentsByIds,
    urlValues: { ids },
    method: "get",
  });
}

export default FBFilesPresenterState;
