import { Collection } from "mobx-rest";
import { FETCH_VALIDATORS_REMOTE_URL_URL } from "../../../../state/ducks/auth/constants";
import { FBValidatorModel } from "../models/FBValidatorModel";

export class FBValidatorCollection extends Collection<FBValidatorModel> {
  public url() {
    return FETCH_VALIDATORS_REMOTE_URL_URL;
  }

  public model() {
    return FBValidatorModel;
  }
}

export default new FBValidatorCollection();
