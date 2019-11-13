import { Collection } from 'mobx-rest';
import { FBValidatorModel } from '../models/FBValidatorModel';
import { FETCH_VALIDATORS_REMOTE_URL_URL } from '../../../../state/ducks/auth/constants';

export class FBValidatorCollection extends Collection<FBValidatorModel> {
  public url() {
    return FETCH_VALIDATORS_REMOTE_URL_URL;
  }

  public model() {
    return FBValidatorModel;
  }
}
