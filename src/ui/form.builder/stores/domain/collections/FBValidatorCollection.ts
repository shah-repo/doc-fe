
import { Collection } from "mobx-rest";
import { SelectOption } from "../../../../components/forms/fields/Select";
import { FBValidatorModel } from "../models/FBValidatorModel";

export class FBValidatorCollection extends Collection<FBValidatorModel> {
  public data(): Array<Partial<FBValidatorModel>> {
    // tslint:disable-next-line: no-console
    // console.log(_.get(window, "EnlilRemoteValidators.availableRules"));
    // return (window as any).EnlilRemoteValidators.availableRules;
    return [
      {
        name: "required",
        pattern: "required",
        description: "Check if the length of the String representation of the value is >",
        applicableIn: "all",
        indicators: [],
      },
      {
        name: "required_if",
        pattern: "required_if",
        description: "The field must be present and not empty if the anotherfield field is equal to any value.",
        applicableIn: "all",
        indicators: [{
          type: "schemaSelect",
          label: "Required if field",
          validatorDelimiter: ":",
          hasSchemaItem: true,
        }],
      },
      {
        name: "required_with",
        pattern: "required_with:foo,bar,...",
        description: "The field under validation must be present and not empty only if any of the other specified fields are present.",
        applicableIn: "all",
        indicators: [
          {
            label: "Required with field value:",
            type: "schemaSelect",
            validatorDelimiter: ":",
          },
        ],
      },
      {
        name: "required_document_status",
        pattern: "required_document_status:value",
        description: "Selected document must be in status.",
        applicableIn: "textfield|select...",
        indicators: [
          {
            label: "Must be in:",
            options: [
              {value: "DRAFT", text: "DRAFT"},
              {value: "PENDING_CHANGE", text: "PENDING CHANGE"},
              {value: "IN_REVIEW", text: " IN REVIEW"},
              {value: "RELEASED", text: "RELEASED"},
            ],
            type: "select",
            validatorDelimiter: ":",
          },
        ],
      },
      {
        name: "required_document_type",
        pattern: "required_document_type:anotherfield, value",
        description: "Selected document must be of selected type.",
        applicableIn: "textfield|select...",
        indicators: [
          {
            optionId: "4",
            multiple: false,
            label: "Must be of type:",
            type: "autocomplete",
            validatorDelimiter: ":",
          },
        ],
      },
    ];
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
