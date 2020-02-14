import _ from "lodash";
import { action, set } from "mobx";
import { FETCH_VALIDATORS_REMOTE_URL_URL } from "../../../../state/ducks/auth/constants";
import { RemoteValidatorHelper } from "../../../remoteValidators/remoteValidatorsHelper";
import FBRequest from "../../FBApi/FBApi.request";

export class FBActionContainerState extends FBRequest {
  constructor() {
    super();
    this.data = _.get(window, "EnlilRemoteValidators.avaliableActions");
    if (!_.isEmpty(this.data) && !_.isUndefined(this.data)) {
      return;
    }
    this.url = FETCH_VALIDATORS_REMOTE_URL_URL;
    this.fetch();
  }

  @action public onDataLoaded = async () => {
    await import(/* webpackIgnore: true */ this.data.url);
    (window as any).EnlilRemoteValidators.registerHelperCallback(
      () => RemoteValidatorHelper,
    );
    set(this, "data", _.get(window, "EnlilRemoteValidators.avaliableActions"));
  }
}

export default FBActionContainerState;
