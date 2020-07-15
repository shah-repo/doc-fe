import { action, observable } from "mobx";

export class FBAutocompleteAsyncStore {
  @observable public data = new Map<string, any>();
  @observable public loading = new Map<string, boolean>();

  @action public setOptionData = (optionId: string, data: any) => {
    this.data.set(optionId, observable.map(
      (data as any[]).map((show: any) => [show.id, show]),
      { deep: false }
    ));
  };

  public get = <T>(optionId: string, id: string): T | undefined => {
    const list = this.data.get(optionId);
    return list.get(id) as T;
  }
}

export default new FBAutocompleteAsyncStore();
