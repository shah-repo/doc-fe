import _ from "lodash";
import { action, observable, set } from "mobx";
import FBRequest from "../FBApi/FBApi.request";

export class FBAutocompleteState extends FBRequest {
  @observable public defaultValue: any;
  public defaultState: string | string[] | undefined;

  @action public setUrl = (url: string) => {
    set(this, "url", url);
    this.fetch();
  }

  @action public onDataLoaded = () => {
    this.defaultState && (this.setDefaultValue(this.defaultState));
  }

  @action public setDefaultState = (state: string | string[] | undefined) => {
    set(this, "defaultState", state);
  }

  @action private setDefaultValue = (value: string | string[] | undefined) => {
    if (_.isUndefined(value) || _.isEmpty(this.data)) {
     return;
    }
    this.setLoading(true);
    const defaultValue = _.isArray(value) ? value : [value];
    const filtered = _.filter(this.data, (rec) => _.includes(defaultValue, rec.id));
    set(this, "defaultValue", (_.isArray(value) ? filtered : _.first(filtered)));
    this.setLoading(false);
  }
}

export default FBAutocompleteState;
