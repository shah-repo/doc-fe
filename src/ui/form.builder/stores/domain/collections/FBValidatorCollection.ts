import { Collection } from "mobx-rest";
import { SelectOption } from "../../../../components/forms/fields/Select";
import { FBValidatorModel } from "../models/FBValidatorModel";

class FBValidatorCollection extends Collection<FBValidatorModel> {
  public data(): Partial<FBValidatorModel>[] {
    return (window as any).EnlilRemoteValidators.availableRules;
    // return validatorData as FBValidatorModel[];
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
