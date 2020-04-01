import _ from "lodash";
import { action, observable } from "mobx";

export class FBAutocompleteAsyncStore {
  @observable public data = new Map<string, any>();

  public getData = (optionId: string): any => {
    if (this.data.get(optionId)) {
      return Array.from(this.data.get(optionId).values());
    }
  };

  public getValue = (id: string | string[]): any => {
    if (!_.isArray(id)) {
      return this.data.get(id);
    }
    return _.map(id, (i) => this.data.get(i));
  };

  @action public setOptionData = (optionId: string, data: any) => {
    this.data.set(optionId, observable.map(
      (data as any[]).map((show: any) => [show.id, show]),
      { deep: false }
    ));
  };
}

export default new FBAutocompleteAsyncStore();
