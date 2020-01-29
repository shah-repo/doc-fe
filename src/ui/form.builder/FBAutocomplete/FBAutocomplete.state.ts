import _ from "lodash";
import { action, observable, set } from "mobx";
import { FBAutocompleteIndicator } from ".";
import autocompleteOptions from "../../../data/autocompleteOptions.json";
import FBRequest from "../FBApi/FBApi.request";

export class FBAutocompleteState extends FBRequest {
  @observable public renderKey: string = "id";
  @observable public defaultValue: any;
  public name: string = "";
  public defaultValueId: string | undefined;
  public isDirty: boolean = false;

  @action public setUrl = (url: string) => {
    set(this, "url", url);
    this.fetch();
  }

  @action public setRenderKey = (key: string = "") => {
    set(this, "renderKey", key);
  }

  @action public getIndicator = (id: string | undefined): FBAutocompleteIndicator | undefined => {
    if (_.isUndefined(id)) {
      return;
    }
    return _.find(autocompleteOptions, { id });
  }

  @action public setDefaultValue = (id: string | undefined) => {
    if (_.isUndefined(id) || _.isEmpty(this.data)) {
     return;
    }
    this.setLoading(true);
    set(this, "defaultValue", _.find(this.data, (rec) => rec.id === id));
    this.setLoading(false);
  }

  @action public setName = (name: string) => {
    set(this, "name", name);
  }

  @action public onDataLoaded = () => {
    if (_.isUndefined(this.defaultValueId)) {
      return;
    }
    this.setDefaultValue(this.defaultValueId);
  }

  @action public setDirty = () => {
    set(this, "isDirty", true);
  }
}

export default FBAutocompleteState;
