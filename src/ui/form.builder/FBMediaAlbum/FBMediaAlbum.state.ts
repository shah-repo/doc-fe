import { action, observable, set } from "mobx";
import { FBMediaAlbumMode } from "..";

export class FBMediaAlbumState {
  @observable public activeMedia: number | undefined;
  @observable public mode: FBMediaAlbumMode = "carousel";

  @action public setActiveMedia = (index: number) => {
    set(this, "activeMedia", index);
  };

  @action public setMode = (mode: FBMediaAlbumMode) => {
    set(this, "mode", mode);
  };
}

export default FBMediaAlbumState;
