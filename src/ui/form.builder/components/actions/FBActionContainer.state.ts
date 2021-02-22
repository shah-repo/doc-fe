import { get, isEmpty, isUndefined } from "lodash";
import { action, set } from "mobx";
import { FETCH_VALIDATORS_REMOTE_URL_URL } from "../../../../state/ducks/auth";
import { RemoteValidatorHelper } from "../../../remoteValidators/remoteValidatorsHelper";
import FBRequest from "../../FBApi/FBApi.request";

class FBActionContainerState extends FBRequest<any, any> {
  constructor() {
    super();
    this.data = get(window, "EnlilRemoteValidators.avaliableActions");
    if (!isEmpty(this.data) && !isUndefined(this.data)) {
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
    set(this, "data", get(window, "EnlilRemoteValidators.avaliableActions"));
  };
}

export default FBActionContainerState;
