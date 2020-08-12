import _, { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import Validator from "validatorjs";
import { SelectOption } from "../../../components/forms/fields/Select";
import { FBEditorElementType } from "../../types/editor";
import { FBValidatorTrigger } from "../../types/validation/validator";
import { FBValidatorConfigProps } from "../../types/validation/validatorDialog";
import FBStore from "./FBStore";

export class FormBuilderValidatorStored {
  @observable public errors: Dictionary<string> = {};
  @observable public indicatorValues: Dictionary<Dictionary<any>> = {};
  public applicableOn = false;
  public activeValidatorType?: FBEditorElementType;
  public customValidator?: FBValidatorConfigProps;
  public formValues: Dictionary<any> = {};
  public selectedFieldIndex: number | null = null;

  @computed get schemaItemOptions(): SelectOption[] {
    const schema = _.isNull(this.selectedFieldIndex) ?
      FBStore.getSchema() :
      (FBStore.getSchema()).filter((item) => item.index !== this.selectedFieldIndex);
    return schema.map((schemaItem) => ({
      value: schemaItem.name,
      text: schemaItem.label,
    } as SelectOption));
  }

  @action public setActiveValidatorType = (type: FBEditorElementType) => {
    this.activeValidatorType = type;
  };

  @action public getRules = (): string | undefined => {
    const flattenArray = _.map(this.indicatorValues, (v, k) => {
      _.map(v, (val, key) => (k += `${key}${val}`));
      return k;
    });
    return flattenArray.join("|");
  };

  @action public getSchemaRules = (): Dictionary<string> => {
    const rules: Dictionary<string> = {};
    _.map(FBStore.getSchema(), (schemaItem) => {
      if (
        schemaItem.rules &&
        schemaItem.rules !== "" &&
        _.isEmpty(schemaItem.applicableOn)
      ) {
        rules[schemaItem.name || ""] = schemaItem.rules;
      }
    });
    return rules;
  };

  @action public getSchemaReleasedRules = (): Dictionary<string> => {
    const rules: Dictionary<string> = {};
    _.map(FBStore.getSchema(), (schemaItem) => {
      if (
        schemaItem.rules &&
        schemaItem.rules !== "" &&
        !_.isEmpty(schemaItem.applicableOn)
      ) {
        rules[schemaItem.name || ""] = schemaItem.rules;
      }
    });
    return rules;
  };

  @action public getRulesBy = (
    schemaItemName: string,
  ): Dictionary<string> | undefined => {
    const rules: Dictionary<string> = {};
    return rules;
  };

  @action public getValidatorNames = (): Dictionary<string> => {
    const names: Dictionary<string> = {};
    _.map(FBStore.getSchema(), (schemaItem) => {
      const { label, placeholder, name } = schemaItem;
      if (!_.isUndefined(name)) {
        _.assign(names, { [name]: label || placeholder || name });
      }
    });
    return names;
  };

  @action public resetIndicatorValues = () => {
    this.indicatorValues = {};
  };

  @action public hasError = (name: string): boolean => Boolean(this.errors[name]);

  @action public errorText = (name: string): string => this.errors[name] || "";

  @action public triggers = (): SelectOption[] => _.map(
    FBValidatorTrigger,
    (k, v) => ({ value: `applicableOn-${v}`, text: k } as SelectOption),
  );

  @action public validate = (
    data: any,
    rules: Dictionary<any>,
    attributes?: Validator.AttributeNames,
  ): Validator.ValidationErrors => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const flatten = require("flat");
    Validator.register(
      "",
      () => true,
      "",
    );

    const validator = new Validator(flatten(data), rules);

    if (!_.isUndefined(attributes)) {
      validator.setAttributeNames(attributes);
    }

    if (validator.fails()) {
      return validator.errors.all();
    }
    return {};
  };
}

const FBValidatorStore = new FormBuilderValidatorStored();
export default FBValidatorStore;
