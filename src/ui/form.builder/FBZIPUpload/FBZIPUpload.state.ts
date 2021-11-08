import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBZIPUploadState {
  public startAttachmentUnzipping:
  FBRequest<{docRevisionId: string; attachmentId: string}, any> = new FBRequest();

  public startUnzipping = (values: {docRevisionId: string; attachmentId: string}) => {
    this.startAttachmentUnzipping.set({
      url: FBEndpoint.AttachmentUnzipping,
      body: values,
      method: "post",
    });
  };

}

export default FBZIPUploadState;
