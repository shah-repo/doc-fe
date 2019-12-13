import _ , { Dictionary } from "lodash";
import { action, computed, observable } from "mobx";
import Validator from "validatorjs";
import { SelectOption } from "../../../components/forms/fields/Select";
import { FBValidatorTrigger } from "../../types/validation/validator";
import FBStore from "./FBStore";

export class FormBuilderValidatorStore {
  @observable public errors: Dictionary<string> = {};
  @observable public indicatorValues: Dictionary<Dictionary<string>> = {};
  public applicableOn: boolean = false;

  @computed get schemaItemOptions(): SelectOption[] {
    const schema = FBStore.getSchema();
    return schema.map((schemaItem) => {
      return {
        value: schemaItem.name,
        text: schemaItem.label,
      } as SelectOption;
    });
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
    // _.map(FBStore.getSchema(), (schemaItem) => {
    //   if (schemaItem.rules && schemaItem.rules !== "" && _.isEmpty(schemaItem.applicableOn)) {
    //     rules[schemaItem.name || ""] = schemaItem.rules;
    //   }
    // });
    return rules;
  }

  @action public getSchemaReleasedRules = (): Dictionary<string> => {
    const rules: Dictionary<string> = {};
    // _.map(FBStore.getSchema(), (schemaItem) => {
    //   if (schemaItem.rules && schemaItem.rules !== "" && !_.isEmpty(schemaItem.applicableOn)) {
    //     rules[schemaItem.name || ""] = schemaItem.rules;
    //   }
    // });
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

const FBValidatorStore = new FormBuilderValidatorStore();
export default FBValidatorStore;
