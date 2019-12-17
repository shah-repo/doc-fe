import _ , { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import Validator from "validatorjs";
import { SelectOption } from "../../../components/forms/fields/Select";
import { FBEditorElementType } from "../../types/editor";
import { FBValidatorTrigger } from "../../types/validation/validator";
import { FBValidatorConfigProps } from "../../types/validation/validatorDialog";
import FBStore from "./FBStore";
import Base64 from "Base64";

export class FormBuilderValidatorStore {
  @observable public errors: Dictionary<string> = {};
  @observable public indicatorValues: Dictionary<Dictionary<string>> = {};
  @observable public helperText: Dictionary<string> = {};
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
    // const schema = FBStore.getSchema();
    const rules: Dictionary<string> = {};
    return rules;

    // _.map(schema, (schemaItem) => {
    //   const isUnderValidation = (
    //     (schemaItem.name === schemaItemName ||
    //     (schemaItem.rules || "").includes(schemaItemName)) &&
    //     _.isEmpty(schemaItem.applicableOn)
    //   );
    //   if (isUnderValidation) {
    //     rules[schemaItem.name || ""] = schemaItem.rules || "";
    //   }
    // });

    // if (!rules[schemaItemName] &&  _.size(rules) > 0) {
    //   rules[schemaItemName] = "";
    // }
    // return _.isEmpty(rules) ? undefined : rules;
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

  @action public getFieldNames = (): string[] => {
    const keys: string[] = [];
    _.map(FBStore.getSchema(), (schemaItem) => {
      if (schemaItem.type === "checkboxgroup") {
        const options = _.split((schemaItem.options || "") as string, "\n");
        _.map(options, (option) => {
          keys.push(`${schemaItem.name}-${_.toLower(option).replace(" ", "-")}-option`);
        });
      } else {
        keys.push(schemaItem.name || "");
      }

      if (schemaItem.includeContext) {
        keys.push(`${schemaItem.name}-other`);
      }
    });
    return keys;
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

  @action public customValidate = () => {

    Validator.register(
      "", () => {
        return true;
      }, "",
    );

    _.map(FBStore.getSchema(), (schemaItem) => {
      const { customValidator } = schemaItem;
      if (!_.isUndefined(customValidator)) {
        Validator.register(
          customValidator.name,
          // tslint:disable-next-line: no-eval
          eval(Base64.atob(customValidator.fn)),
          customValidator.errorMessage || "",
        );
      }
    });

    const rules = {};
    _.map(FBStore.getSchema(), (schemaItem) => {
      const { customValidator } = schemaItem;
      if (!_.isUndefined(customValidator)) {
        rules[schemaItem.name || ""] = [{ [customValidator.name]: FBStore.getValidationValues()}];
      } else {
        rules[schemaItem.name || ""] = "";
      }
    });

    const validator = new Validator(
      FBStore.getValidationValues(),
      rules,
    );

    this.helperText = {};
    if (validator.fails()) {
      const errors = validator.errors.all();
      _.map(errors, (v, k) => {
        this.helperText[k] = _.join(v, "\n");
      });
    }
  }

  @action public getErrorText = (fieldName: string): string | undefined => {
    return _.get(this.helperText, fieldName);
  }
}

const FBValidatorStore = new FormBuilderValidatorStore();
export default FBValidatorStore;
