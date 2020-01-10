import _ , { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import Validator from "validatorjs";
import { SelectOption } from "../../../components/forms/fields/Select";
import { FBEditorElementType } from "../../types/editor";
import { FBValidatorTrigger } from "../../types/validation/validator";
import { FBValidatorConfigProps } from "../../types/validation/validatorDialog";
import FBDynamicValidatorStore from "./FBDynamicValidatorStore";
import FBStore from "./FBStore";

export class FormBuilderValidatorStored {
  @observable public errors: Dictionary<string> = {};
  @observable public indicatorValues: Dictionary<Dictionary<string>> = {};
  public applicableOn: boolean = false;
  public activeValidatorType?: FBEditorElementType;
  public customValidator?: FBValidatorConfigProps;

  @computed get schemaItemOptions(): SelectOption[] {
    const schema = FBStore.getSchema();
    return schema.map((schemaItem) => {
      return {
        value: schemaItem.name,
        text: schemaItem.label,
      } as SelectOption;
    });
  }

  @action public setActiveValidatorType = (type: FBEditorElementType) => {
    this.activeValidatorType = type;
  }

  @action public getRules = (): string | undefined => {
    const flattenArray = _.map(this.indicatorValues, (v, k) => {
      _.map(v, (val, key) => k += `${key}${val}`);
      return k;
    });
    return flattenArray.join("|");
  }

  @action public getSchemaRules = (): Dictionary<string> => {
    const rules: Dictionary<string> = {};
    _.map(FBStore.getSchema(), (schemaItem) => {
      if (schemaItem.rules && schemaItem.rules !== "" && _.isEmpty(schemaItem.applicableOn)) {
        rules[schemaItem.name || ""] = schemaItem.rules;
      }
    });
    return rules;
  }

  @action public getSchemaReleasedRules = (): Dictionary<string> => {
    const rules: Dictionary<string> = {};
    _.map(FBStore.getSchema(), (schemaItem) => {
      if (schemaItem.rules && schemaItem.rules !== "" && !_.isEmpty(schemaItem.applicableOn)) {
        rules[schemaItem.name || ""] = schemaItem.rules;
      }
    });
    return rules;
  }

  @action public getRulesBy = (schemaItemName: string): Dictionary<string> | undefined => {
    const rules: Dictionary<string> = {};
    return rules;
  }

  @action public getValidatorNames = (): Dictionary<string> => {
    const names: Dictionary<string> = {};
    _.map(FBStore.getSchema(), (schemaItem) => {
      const { label, placeholder, name } = schemaItem;
      if (!_.isUndefined(name)) {
        _.assign(names, {[name]: label || placeholder || name});
      }
    });
    return names;
  }

  @action public resetIndicatorValues = () => {
      this.indicatorValues = {};
  }

  @action public hasError = (name: string): boolean => {
    return Boolean(this.errors[name]);
  }

  @action public errorText = (name: string): string => {
    return this.errors[name] || "";
  }

  @action public triggers = (): SelectOption[] => {
    return _.map(FBValidatorTrigger, (k, v) =>
      ({ value: `applicableOn-${v}`, text: k } as SelectOption));
  }

  @action public uiValidate = () => {
    if (FBStore.mode !== "form") {
      return;
    }
    const RemoteValidator = _.get(window, "EnlilRemoteValidators.validator");
    const rules = this.getSchemaReleasedRules();
    const values = FBStore.getUIValues();
    //FBStore.getValues();

    const validator = new RemoteValidator(values, rules);
    if (validator.fails()) {
      const errors = validator.errors.all();
      _.map(errors, (v, k) => {
        FBDynamicValidatorStore.setHelperText(k, _.join(v, "\n"));
      });
    }
  }

  @action public validate = (
    data: any,
    rules: Dictionary<any>,
    attributes?: Validator.AttributeNames,
  ): Validator.ValidationErrors => {
    const flatten = require("flat");
    Validator.register(
      "", () => {
        return true;
      }, "",
    );

    const validator = new Validator(
      flatten(data),
      rules,
    );

    if (!_.isUndefined(attributes)) {
      validator.setAttributeNames(attributes);
    }

    if (validator.fails()) {
      return validator.errors.all();
    }
    return {};
  }
}

const FBValidatorStore = new FormBuilderValidatorStored();
export default FBValidatorStore;
