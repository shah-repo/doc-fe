import { isEmpty, map } from "lodash";
import { action, observable } from "mobx";

export class FBAutocompleteAsyncStore {
  @observable public data = new Map<string, any>();
  @observable public loading = new Map<string, boolean>();

  @action public setOptionData = (optionId: string, data: any) => {
    this.data.set(optionId, observable.map(
      (data as any[]).map((show: any) => [show.id || show.value, show]),
      { deep: false }
    ));
  };

  public getValue = <T>(optionId?: string, by?: string): T | undefined => {
    if (!optionId || !by) { return; }
    const list = this.data.get(optionId);
    if (!list) { return; }
    return list.get(by) as T;
  };

  public getValues = <T>(optionId?: string, by?: string[]): T[] | undefined => {
    if (!optionId || !by || isEmpty(by)) { return; }
    const list = this.data.get(optionId);
    if (!list) { return; }
    return Array.from(map(by, (i) => list.get(i))) as T[];
  };

  public add = <T>(optionId: string, key?: string, value?: T | undefined) => {
    if (!optionId || !key || isEmpty(key)) { return; }
    const list = this.data.get(optionId);
    list?.set(key, value);
  };

  public reset = <T>(optionId: string) => {
    if (!optionId) { return; }
    this.data.set(optionId, undefined);
  };
}

export default new FBAutocompleteAsyncStore();
