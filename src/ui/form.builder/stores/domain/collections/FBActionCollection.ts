import { Collection } from 'mobx-rest';
import { FBActionModel } from '../models/FBActionModel';
import actionData from '../../../../../data/fbActions.json';
import _ from 'lodash';
import { FBValidatorIndicatorProps } from '../../../types/validation/validator';

export class FBActionCollection extends Collection<FBActionModel> {
  public data(): Array<Partial<FBActionModel>> {
    return actionData;
    // return (window as any).EnlilRemoteValidators.availableRules;
  }

  public url() {
    return '';
  }

  public model() {
    return FBActionModel;
  }

  public getAction = (name: string): Partial<FBActionModel> | undefined => {
    const filtered = _.filter(this.data(), action => action.name === name);
    return _.first(filtered);
  };

  public getIndicators = (
    name: string,
  ): Array<Partial<FBValidatorIndicatorProps>> | undefined => {
    return (this.getAction(name) || {}).indicators;
  };
}

const actionCollection = new FBActionCollection();
export default actionCollection;
