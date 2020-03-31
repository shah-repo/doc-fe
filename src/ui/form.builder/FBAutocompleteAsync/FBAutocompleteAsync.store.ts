import { action, observable, set } from "mobx";

export class FBAutocompleteAsyncStore {
  @observable public data = new Map<string, any>();

  @action public setOptionData = (optionId: string, data: any) => {
    set(this.data, optionId, data);
  };
}

export default new FBAutocompleteAsyncStore();
