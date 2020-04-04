import { action, observable } from "mobx";

export class FBAutocompleteAsyncStore {
  @observable public data = new Map<string, any>();

  @action public setOptionData = (optionId: string, data: any) => {
    this.data.set(optionId, observable.map(
      (data as any[]).map((show: any) => [show.id, show]),
      { deep: false }
    ));
  };
}

export default new FBAutocompleteAsyncStore();
