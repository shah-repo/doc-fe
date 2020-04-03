import _ from "lodash";
import { action, computed, set } from "mobx";
import { FBAutocompleteAsyncConfig } from "..";
import autocompleteOptions from "../../../data/autocompleteOptions.json";
import FBRequest from "../FBApi/FBApi.request";
import FBAutocompleteAsyncStore from "./FBAutocompleteAsync.store";

export class FBAutocompleteAsyncState extends FBRequest<any, any> {
  private optionId: string | undefined;

  @computed public get optionConfig(): FBAutocompleteAsyncConfig | undefined {
    if (!this.optionId) {
      return;
    }
    return  _.find(autocompleteOptions, { id: this.optionId });
  }

  @computed public get sliceData(): any {
    if (!this.optionId) {
      return;
    }
    if (FBAutocompleteAsyncStore.data.get(this.optionId)) {
      return Array.from(FBAutocompleteAsyncStore.data.get(this.optionId).values());
    }
  }

  public sliceValue = (id: string | string[]): any => {
    if (!this.optionId) {
      return;
    }
    const options = FBAutocompleteAsyncStore.data.get(this.optionId);
    if (!_.isArray(id)) {
      return options.get(id);
    }
    return Array.from(_.map(id, (i) => options.get(i)));
  };

  @action public setOptionId = (id?: string) => {
    set(this, "optionId", id);
  };

  @action public load = () => {
    if (!this.optionConfig) {
      return;
    }
    const { path: url, root = "" } = this.optionConfig;
    this.setUrl(url);
    this.setRoot(root);
    this.fetch();
  };

  @action public onSuccess = () => {
    if (!this.optionId) {
      return;
    }
    if (!this.data.some((value) => typeof value === "object")) {
      const data = _.map(this.data, (d) => ({ id: d, name: d }));
      return FBAutocompleteAsyncStore.setOptionData(this.optionId, data);
    }
    FBAutocompleteAsyncStore.setOptionData(this.optionId, this.data.slice());
  };
}

export default FBAutocompleteAsyncState;
