import { Collection } from "mobx-rest";
import { SelectOption } from "../../../../components/forms/fields/Select";
import { FBValidatorModel } from "../models/FBValidatorModel";

export class FBValidatorCollection extends Collection<FBValidatorModel> {
  public data(): Array<Partial<FBValidatorModel>> {
    return (window as any).EnlilRemoteValidators.availableRules;
    // return [
    //   {
    //     name: "required",
    //     pattern: "required",
    //     description: "Check if the length of the String representation of the value is >",
    //     applicableIn: "all",
    //     indicators: [],
    //   },
    //   {
    //     name: "required_if",
    //     pattern: "required_if",
    //     description: "The field must be present and not empty if the anotherfield field is equal to any value.",
    //     applicableIn: "all",
    //     indicators: [{
    //       type: "schemaSelect",
    //       label: "Required if field",
    //       validatorDelimiter: ":",
    //       hasSchemaItem: true,
    //     }],
    //   },
    //   {
    //     name: "required_with",
    //     pattern: "required_with:foo,bar,...",
    //     description: "The field under validation must
    //     be present and not empty only if any of the other specified fields are present.",
    //     applicableIn: "all",
    //     indicators: [],
    //   },
    //   {
    //     name: "required_document_type",
    //     pattern: "required_document_type:anotherfield, value",
    //     description: "Selected document must be of value.",
    //     applicableIn: "textfield|select...",
    //     indicators: [],
    //   },
    // ];
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
