import { action, observable, set } from "mobx";
import { FBFilePreviewType, FBMediaAlbumMode, FBMediaProps } from "..";
import { SUPPORTED_VIDEO_FILES } from "../../components/common/view.file/utils/constants";

export class FBMediaAlbumState {
  @observable public activeMedia: number | undefined;
  @observable public mode: FBMediaAlbumMode = "carousel";

  @action public setActiveMedia = (index: number) => {
    set(this, "activeMedia", index);
  };

  @action public setMode = (mode: FBMediaAlbumMode) => {
    set(this, "mode", mode);
  };

  // Helpers
  public previewType = (media: FBMediaProps): FBFilePreviewType | undefined => {
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
