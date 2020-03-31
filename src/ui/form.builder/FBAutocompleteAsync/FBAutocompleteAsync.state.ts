import _ from "lodash";
import { action, computed, observable, set } from "mobx";
import { FBAutocompleteAsyncConfig, FBAutocompleteAsyncStore } from "..";
import autocompleteOptions from "../../../data/autocompleteOptions.json";
import FBRequest from "../FBApi/FBApi.request";

export class FBAutocompleteAsyncState extends FBRequest<any, any> {
  @observable public loaded = false;
  private optionId: string | undefined;

  @computed public get optionConfig(): FBAutocompleteAsyncConfig | undefined {
    if (!this.optionId) {
      return;
    }
    return  _.find(autocompleteOptions, { id: this.optionId });
  }

  @action public setOptionId = (id: string) => {
    set(this, "optionId", id);
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
    if (!this.data.some((d) => d.id)) {
      const data = _.map(this.data, (d) => ({ id: d, name: d }));
      return FBAutocompleteAsyncStore.setOptionData(this.optionId, data);
    }
    FBAutocompleteAsyncStore.setOptionData(this.optionId, this.data);
  };
}

export default FBAutocompleteAsyncState;
