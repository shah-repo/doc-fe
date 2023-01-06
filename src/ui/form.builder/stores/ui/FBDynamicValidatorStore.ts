import { Dictionary, get, isUndefined, join, map, toString } from "lodash";
import { action, computed, observable, set } from "mobx";
import Validator from "validatorjs";
import FBStore from "./FBStore";
import FBValidatorStore from "./FBValidatorStore";

class FormBuilderDynamicValidatorStore {
  @computed get Validator(): any {
    return get(window, "EnlilRemoteValidators.validator");
  }
  public validatorName?: string;
  @observable public errorMessage = "";
  @observable public helperText: Dictionary<string> = {};

  @action public setValidatorName = (name: string) => {
    this.reset();
    this.validatorName = name;
  };

  @action public setErrorMessage = (message: string) => {
    this.errorMessage = message;
  };

  @action public reset = () => {
    this.validatorName = undefined;
    this.errorMessage = "";
    FBValidatorStore.formValues = {};
  };

  @action public validate = () => {
    if (isUndefined(this.Validator)) {
      return;
    }

    // Clear helper text
    set(this, "helperText", {});

    const rules = FBValidatorStore.getSchemaReleasedRules();
    const values = {};
    map(FBStore.getValues(), (v, k) => {
      values[k] = toString(v);
    });
    const validator = new this.Validator(values, rules);

    function passes() { return null; }
    function fails() {
      const errors = validator.errors.all();
      FBDynamicValidatorStore.setHelperText(errors);
    }
    validator.setAttributeNames(FBStore.getValidationAttribute());
    validator.checkAsync(passes, fails);
  };

  @action public setHelperText = (
    errors: Validator.ValidationErrors | Dictionary<string>,
  ) => {
    map(errors, (v, k) => {
      set(this.helperText, k, join(v, "\n"));
    });
  };

  @action public getHelperText = (fieldName: string): string | undefined => get(this.helperText, fieldName);
}

const FBDynamicValidatorStore = new FormBuilderDynamicValidatorStore();
export default FBDynamicValidatorStore;
