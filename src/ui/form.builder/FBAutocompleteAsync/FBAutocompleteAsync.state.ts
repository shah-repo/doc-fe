import { filter, find, groupBy, isArray, last, map, sortBy } from "lodash";
import { action, computed, set } from "mobx";
import { FBAutocompleteAsyncConfig, FBAutocompleteAsyncOption, FBData } from "..";
import FBRequest from "../FBApi/FBApi.request";
import FBAutocompleteAsyncStore from "./FBAutocompleteAsync.store";

export class FBAutocompleteAsyncState extends FBRequest<any, any> {
  private optionId: string | undefined;

  public constructor(optionId?: string) {
    super();
    this.setOptionId(optionId);
  }

  @computed public get optionConfig(): FBAutocompleteAsyncConfig | undefined {
    if (!this.optionId) {
      return;
    }
    return find(FBData.autocompleteOptions, { id: this.optionId });
  }

  @computed public get sliceData(): any {
    if (!this.optionId) {
      return;
    }
    if (FBAutocompleteAsyncStore.data.get(this.optionId)) {
      return Array.from(FBAutocompleteAsyncStore.data.get(this.optionId).values());
    }
  }

  @action public sliceValue = (id: string | string[]): any => {
    if (!this.optionId) {
      return;
    }
    const options = FBAutocompleteAsyncStore.data.get(this.optionId);
    if (!options) {
      return;
    }
    if (!isArray(id)) {
      return options.get(id);
    }
    return Array.from(map(id, (i) => options.get(i)));
  };

  @action public setOptionId = (id?: string) => {
    set(this, "optionId", id);
    this.load();
  };

  @action public load = (force = false) => {
    if (!this.optionId) {
      return;
    }
    const isLoading = FBAutocompleteAsyncStore.loading.get(this.optionId);
    const hasData = Boolean(FBAutocompleteAsyncStore.data.get(this.optionId));
    if (force || (!hasData && !isLoading)) {
      this.loadInternal();
    }
  };

  @action public prepareData = (data: any[]): any[] | undefined => {
    if (!this.optionId) {
      return;
    }
    // TODO: refactore autocomplete list to reuse doc rev list (check with mobile)
    switch (this.optionId) {
      case FBAutocompleteAsyncOption.activeDocumentRevisions:
      case FBAutocompleteAsyncOption.TLList:
      case FBAutocompleteAsyncOption.CSLList:
      case FBAutocompleteAsyncOption.parts:
      case FBAutocompleteAsyncOption.POList:
      case FBAutocompleteAsyncOption.suppliers:
        return map(
          groupBy(data, "document.docId"), (recs) => last(sortBy(recs, "version"))
        );
      case FBAutocompleteAsyncOption.officialGroups:
        return filter(data, { isOfficial: true });
      default: return data;
    }
  };

  protected onSuccess() {
    super.onSuccess();
    if (!this.optionId) {
      return;
    }
    FBAutocompleteAsyncStore.loading.set(this.optionId, false);
    let data = this.data;
    if (!data) {
      return;
    }
    if (data.some && !data.some((value) => typeof value === "object")) {
      data = map(this.data, (d) => ({ id: d, name: d }));
      return FBAutocompleteAsyncStore.setOptionData(this.optionId, data);
    }
    data.slice && FBAutocompleteAsyncStore.setOptionData(this.optionId, data.slice());
  }

  protected loadInternal() {
    if (!this.optionConfig) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    FBAutocompleteAsyncStore.loading.set(this.optionId!, true);
    const { path: url, root = "" } = this.optionConfig;
    this.setUrl(url);
    this.setRoot(root);
    this.fetch();
  }
}

export default FBAutocompleteAsyncState;

