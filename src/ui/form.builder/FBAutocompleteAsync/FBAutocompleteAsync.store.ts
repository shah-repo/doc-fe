import { isEmpty, map } from 'lodash';
import { action, observable, ObservableMap } from 'mobx';

export class AutocompleteAsyncStore {
  @observable public data = new Map<string, any>();
  @observable public loading = new Map<string, boolean>();

  @action public setOptionData = (optionId: string, data: any, additionalKey?: string) => {
    const optionsKey = this.getOptionsKey(optionId, additionalKey);
    this.data.set(optionsKey, observable.map(
      (data as any[]).map((show: any) => [show.id || show.value, show]),
      { deep: false },
    ));
  };

  private readonly getOptionsKey = (optionId: string, additionalKey?: string): string =>
    additionalKey ? `${optionId}-${additionalKey}` : optionId;

  public getValue = <T>(optionId?: string, by?: string, additionalKey?: string): T | undefined => {
    if (!optionId || !by) { return; }
    const key = this.getOptionsKey(optionId, additionalKey);
    const list = this.data.get(key);
    if (!list) { return; }
    return list.get(by) as T;
  };

  public getValues = <T>(optionId?: string, by?: string[], additionalKey?: string): T[] | undefined => {
    if (!optionId || !by || isEmpty(by)) { return; }
    const optionsKey = this.getOptionsKey(optionId, additionalKey);
    const list = this.data.get(optionsKey);
    if (!list) { return; }
    return Array.from(map(by, (i) => list.get(i))) as T[];
  };

  public add = <T>(optionId: string, key?: string, value?: T | undefined, additionalKey?: string) => {
    if (!optionId || !key || isEmpty(key)) { return; }
    const optionsKey = this.getOptionsKey(optionId, additionalKey);
    const optionsMap = this.data.get(optionsKey);
    if (!optionsMap) {
      this.data.set(optionsKey, new ObservableMap([
        [key, value],
      ]));
    } else {
      optionsMap.set(key, value);
    }
  };

  public reset = (optionId: string, additionalKey?: string) => {
    if (!optionId) { return; }
    const optionsKey = this.getOptionsKey(optionId, additionalKey);
    this.data.set(optionsKey, undefined);
  };
}

export default new AutocompleteAsyncStore();
