import { action, observable } from "mobx";
import { FBMediaProps } from "..";

class FBMediaAlbumFieldStore {
  @observable public data = new Map<string, any>();

  @action public setData = (fieldName: string, data: FBMediaProps[]) => {
    this.data.set(fieldName, observable.map(
      data.map((media: FBMediaProps) => [media.id, media]),
      { deep: false }
    ));
  };
}

export default new FBMediaAlbumFieldStore();
