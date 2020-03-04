import { action, observable, set } from "mobx";
import { FBMediaAlbumMode } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import { FBMediaProps } from "./FBMediaAlbum.types";

export class FBMediaAlbumState {
  @observable public activeMedia: number | undefined;
  @observable public mode: FBMediaAlbumMode = "carousel";
  public collection: FBMediaProps[] | undefined;
  public url = FBEndpoint.AssetUrl;

  @action public setActiveMedia = (index: number) => {
    set(this, "activeMedia", index);
  };

  @action public setMode = (mode: FBMediaAlbumMode) => {
    set(this, "activeMedia", undefined);
    set(this, "mode", mode);
  };

  @action public getMode = (): FBMediaAlbumMode => this.mode;
}

export default FBMediaAlbumState;
