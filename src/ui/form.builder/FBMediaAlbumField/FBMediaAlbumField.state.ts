import { action, observable, set } from "mobx";
import { FBMediaAlbumFieldMode } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";

export class FBMediaAlbumFieldState {
  @observable public mode: FBMediaAlbumFieldMode = "qr";
  public url = FBEndpoint.FileUploadCandidates;

  @action public setMode = (mode: FBMediaAlbumFieldMode) => {
    set(this, "mode", mode);
  };

  @action public getMode = (): FBMediaAlbumFieldMode => this.mode;
}

export default FBMediaAlbumFieldState;
