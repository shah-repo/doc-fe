import { filter, first, get } from "lodash";
import { Collection } from "mobx-rest";
// import actionData from "../../../../../data/fbActions.json";
import { FBValidatorIndicatorProps } from "../../../types/validation/validator";
import { FBActionModel } from "../models/FBActionModel";

export class FBActionCollection extends Collection<FBActionModel> {
  public data(): Partial<FBActionModel>[] {
    // return actionData;
    return get(window, "EnlilRemoteValidators.avaliableActions");
  }

  public url() {
    return "";
  }

  public model() {
    return FBActionModel;
  }

  public getAction = (name: string): Partial<FBActionModel> | undefined => {
    const filtered = filter(this.data(), (action) => action.name === name);
    return first(filtered);
  };

  public getIndicators = (
    name: string,
  ): Partial<FBValidatorIndicatorProps>[] | undefined => (this.getAction(name) || {}).indicators;
}

const actionCollection = new FBActionCollection();
export default actionCollection;
