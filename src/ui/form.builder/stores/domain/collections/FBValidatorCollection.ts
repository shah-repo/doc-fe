import { Collection } from "mobx-rest";
import { SelectOption } from "../../../../components/forms/fields/Select";
import { FBValidatorModel } from "../models/FBValidatorModel";

export class FBValidatorCollection extends Collection<FBValidatorModel> {
  public data(): Array<Partial<FBValidatorModel>> {
    return (window as any).EnlilRemoteValidators.availableRules;
  }

  public url() {
    return "";
  }

  public model() {
    return FBValidatorModel;
  }

  public options(): SelectOption[] {
    return this.data() as SelectOption[];
  }
}

const validatorCollection = new FBValidatorCollection();
export default validatorCollection;
