import { action, observable, set } from "mobx";
import { FBMediaAlbumFieldMode } from "..";

export class FBMediaAlbumFieldState {
  @observable public mode: FBMediaAlbumFieldMode = "qr";

  @action public setMode = (mode: FBMediaAlbumFieldMode) => {
    set(this, "mode", mode);
  };

  @action public getMode = (): FBMediaAlbumFieldMode => {
    return this.mode;
  };
}

export default FBMediaAlbumFieldState;
