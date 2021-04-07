import { action, observable, set } from "mobx";
import { FBAttachment, FBFile, FBFilePreviewType, FBMediaAlbumMode } from "..";
import { Attachment } from "../../../state/ducks/attachments/types";
import { SUPPORTED_VIDEO_FILES } from "../../components/common/view.file/utils/constants";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBMediaAlbumState {
  @observable public activeMedia: number | undefined;
  @observable public mode: FBMediaAlbumMode = "carousel";
  @observable public attachmentApi = new FBRequest<Attachment, FBFile>(FBEndpoint.AttachmentUpload);

  @action public setActiveMedia = (index: number) => {
    set(this, "activeMedia", index);
  };

  @action public setMode = (mode: FBMediaAlbumMode) => {
    set(this, "mode", mode);
  };

  // Helpers
  public previewType = (media: FBAttachment): FBFilePreviewType | undefined => {
    let { type } = media || {};
    if (!type) { return; }
    type = type.split("/")[1];
    switch (true) {
      case SUPPORTED_VIDEO_FILES.includes(type):
        return "video";
      case type === "pdf":
        return "pdf";
      default:
        return "image";
    }
  };
}

export default FBMediaAlbumState;
