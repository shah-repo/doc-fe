import flatten from "flat";
import _, { Dictionary } from "lodash";
import { action, computed, get, observable, set } from "mobx";
import { FBInputState } from "..";
import { FBSchemaProps, FBSchemaState } from "../FBSchema";
import FBStore from "../stores/ui/FBStore";

export class FBFormState extends FBSchemaState {
  public rules: Dictionary<string> = {};
  public validationAttributeNames: Dictionary<string> = {};
  public errorValidation = true;
  @observable public initialValues: Dictionary<any> = {};
  @observable public values: Dictionary<any> = {};
  @observable public errors: Dictionary<string> = {};
  @observable public helpers = new Map<string, string>();
  @observable public inputState = new Map<string, FBInputState>();

  public constructor(schema?: FBSchemaProps[]) {
    super();
    this.schema = schema;
  }

  @computed private get Validator(): any {
    return _.get(window, "EnlilRemoteValidators.validator");
  }

  @action public setInitialValues = (values: Dictionary<any>) => {
    set(this.initialValues, values);
    this.setValues(values);
  };

  @action public setValues = (values: Dictionary<any>) => {
    set(this.values, values);

    // OLD: to be removed
    FBStore.setValues(values);
  };

  @action public getValues = () => this.values;

  @action public getFieldValue = (
    fieldName: string | undefined, defaultValue: any = undefined): any => {
    if (!fieldName) {
      return defaultValue;
    }
    if (!_.get(this.values, fieldName) && !_.isUndefined(defaultValue)) {
      this.initialValues[fieldName] = defaultValue;
    }
    return _.get(this.values, fieldName) || _.get(this.initialValues, fieldName);
  };

  @action public setFieldValue = (
    fieldName: string | undefined,
    value: any,
    withState = false,
  ) => {
    if (!fieldName) {
      return;
    }
    if (_.isUndefined(value)) {
      this.omitFieldValue(fieldName);
    } else {
      this.setValues(_.set(this.values, fieldName, value));
    }
    if (withState) {
      this.inputState.get(fieldName)?.setValue(this.getFieldValue(fieldName));
      this.inputState.get(fieldName)?.setValue(value);
    }
  };

  @action public omitFieldValue = (fieldName?: string) => {
    if (!fieldName) {
      return;
    }
    this.values = _.omit(this.values, fieldName);
  };

  @action public setRules = (rules: Dictionary<string>) => set(this.rules, rules);

  @action public getRules = () => this.rules;

  @action public setErrors = (errors: Dictionary<string>) => {
    set(this.errors, errors);
  };

  @action public setFieldError = (fieldName: string, error: string) => {
    this.setErrors({
      ...this.errors,
      [fieldName]: error,
    });
  };

  @action public getFieldError = (fieldName: string): string | undefined => get(this.errors, fieldName);

  @action public setHelpers = (helpers: Dictionary<string>) => {
    set(this, "helpers", helpers);
  };

  @action public setFieldHelper = (fieldName: string, value: string) => {
    set(this.helpers, fieldName, value);
  };

  @action public getFieldHelper = (fieldName: string) => get(this.helpers, fieldName);

  @action public setFieldRules = (fieldName: string, rules: string | undefined) => {
    if (_.isUndefined(rules)) {
      return;
    }
    this.rules = {
      ...this.rules,
      [fieldName]: rules,
    };
  };

  @action public setValidationAttributeName = (fieldName: string, attrName: string) => {
    this.validationAttributeNames = {
      ...this.validationAttributeNames,
      [fieldName]: attrName,
    };
  };

  @action public validate = (callback?: (valid: boolean) => any) => {
    if (_.isUndefined(this.Validator)) {
      return;
    }

    const rules = this.getRules();
    const values = flatten(this.getValues());
    // const values =  _.mapValues(this.getValues(), (v, k) => {
    //   if (_.isBoolean(v)) {
    //     return _.toString(v);
    //   } else if (_.isObject(v) && !_.isArray(v)) {
    //     return flatten(v);
    //   }
    //   return v;
    // });

    const validator = new this.Validator(values, rules);
    validator.setAttributeNames(this.validationAttributeNames);

    this.helpers.clear();
    function passes() {
      callback && callback(true);
    }

    validator.checkAsync(passes, () => {
      const errors = validator.errors.all();
      _.map(errors, (v, k) => this.setFieldHelper(k, _.join(v, "\n")));
      callback && callback(false);
    });
  };
}

export default FBFormState;
