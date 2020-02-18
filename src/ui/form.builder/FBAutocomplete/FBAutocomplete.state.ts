import _ from "lodash";
import { action, observable, set } from "mobx";
import { FBAutocompleteIndicator } from ".";
import autocompleteOptions from "../../../data/autocompleteOptions.json";
import FBRequest from "../FBApi/FBApi.request";

export class FBAutocompleteState extends FBRequest {
  public defaultValue: any;
  @observable public loaded: boolean = false;
  public defaultState: string | string[] | undefined;

  @action public setUrl = (url: string) => {
    set(this, "url", url);
    this.fetch();
  }

  @action public onDataLoaded = () => {
    !_.isUndefined(this.defaultState) &&
      this.setDefaultValue(this.defaultState);
  }

  @action public setDefaultState = (state: string | string[] | undefined) => {
    set(this, "defaultState", state);
  }

  @action public getIndicator = (
    id: string | undefined,
  ): FBAutocompleteIndicator | undefined => {
    if (_.isUndefined(id)) {
      return;
    }
    return _.find(autocompleteOptions, { id });
  }

  @action private setDefaultValue = (value: string | string[] | undefined) => {
    if (_.isUndefined(value) || _.isEmpty(this.data)) {
      set(this, "loaded", true);
      return;
    }
    this.setLoading(true);
    const defaultValue = _.isArray(value) ? value : [value];
    const filtered = _.filter(this.data, (rec) =>
      _.includes(defaultValue, rec.id),
    );
    set(this, "defaultValue", _.isArray(value) ? filtered : _.first(filtered));
    this.setLoading(false);
    set(this, "loaded", true);
  }
}

export default FBAutocompleteState;
