import { Collection } from "mobx-rest";
import validatorData from "../../../../../data/fbValidators.json";
import { SelectOption } from "../../../../components/forms/fields/Select";
import { FBValidatorModel } from "../models/FBValidatorModel";

export class FBValidatorCollection extends Collection<FBValidatorModel> {
  public data(): Array<Partial<FBValidatorModel>> {
    // tslint:disable-next-line: no-console
    // console.log(_.get(window, "EnlilRemoteValidators.availableRules"));
    // return (window as any).EnlilRemoteValidators.availableRules;
    return validatorData as FBValidatorModel[];
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
