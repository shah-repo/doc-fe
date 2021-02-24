import { flatten, unflatten } from "flat";
import { cloneDeep, Dictionary, get as lodashGet, isArray, isBoolean, isEmpty, isString, isUndefined, join, map, omit, omitBy, set as lodashSet, setWith, values } from "lodash";
import { action, computed, get, observable, set } from "mobx";
import { FBFormConstructor, FBInputState, FBWorkspaceMode, FBWorkspaceState } from "..";
import { FBSchemaState } from "../FBSchema";

class FBFormState extends FBSchemaState {
  public rules: Dictionary<string> = {};
  public validationAttributeNames: Dictionary<string> = {};
  public errorValidation = true;
  public initialValues: Dictionary<any> = {};
  public workspaceMode?: FBWorkspaceMode;
  public values: Dictionary<any> = {};
  public validationValues: Dictionary<any> = {};
  private finalValidationRulse: Dictionary<string> = {};

  // TO BBE REMOVED!
  public workspaceState?: FBWorkspaceState;
  @observable public errors = new Map<string, string>();
  @observable public helpers = new Map<string, string>();
  @observable public inputState = new Map<string, FBInputState>();

  public constructor({ schema, initialValues = {}, workspaceMode, workspaceState }: FBFormConstructor) {
    super();
    this.schema = schema;
    this.initialValues = initialValues || {};
    this.values = initialValues || {};
    map(flatten(initialValues || {}), (value, key) => {
      this.validationValues[key] = value;
    });
    this.validationValues = unflatten(this.validationValues);
    this.workspaceMode = workspaceMode;
    this.workspaceState = workspaceState;
  }

  @computed public get Validator(): any {
    return lodashGet(window, "EnlilRemoteValidators.validator");
  }

  public reset = () => {
    this.initialValues = {};
    this.values = {};
    this.rules = {};
    this.validationAttributeNames = {};
    this.inputState.clear();
    this.validate();
  };

  public getInputState = (name: string): FBInputState | undefined =>
    this.inputState?.get(name);

  @action public setValues = (values: Dictionary<any>) => {
    this.values = values;
  };

  @action public getValues = () => this.values;

  @action public getFieldValue = (
    fieldName: string | undefined,
    defaultValue: any = undefined,
    omitFormValue = false,
  ): any => {
    if (!fieldName) {
      return defaultValue;
    }
    if (isUndefined(lodashGet(this.values, fieldName)) && !isUndefined(defaultValue)) {
      this.setValidationValue(fieldName, defaultValue);
      this.initialValues = {
        ...this.initialValues,
        [fieldName]: defaultValue,
      };
      if (!omitFormValue) {
        lodashSet(this.values, fieldName, defaultValue);
      }
    }
    if (isUndefined(lodashGet(this.values, fieldName))) {
      return lodashGet(this.initialValues, fieldName);
    }
    return lodashGet(this.values, fieldName);
  };

  private setValidationValue = (fieldName: string, value: any) => {
    if (isBoolean(value)) {
      // validatorjs doesn't validate boolean values
      value = `${value}`;
    }
    this.validationValues = {
      ...this.validationValues,
      [fieldName]: value,
    };
  };

  @action public setFieldValue = (
    fieldName: string | undefined,
    value: any,
    withState = false,
    omitFormValue = false,
  ) => {
    if (!fieldName) { return; }
    value = cloneDeep(value);
    if (!omitFormValue) {
      setWith(this.values, fieldName, value);
    }
    this.setValidationValue(fieldName, value);
    if (!withState) { return; }
    this.inputState.get(fieldName)?.setValue(value);
  };

  @action public omitFieldValue = (fieldName?: string) => {
    if (!fieldName) {
      return;
    }
    this.initialValues = omit(this.initialValues, fieldName);
    this.values = omit(this.getValues(), fieldName);
    this.validationValues = omit(this.validationValues, fieldName);
  };

  @action public setRules = (rules: Dictionary<string>) =>
    set(this.rules, rules);

  @action public getRules = () => this.rules;

  @action public setErrors = (errors: Dictionary<string>) =>
    set(this, "errors", errors);

  @action public setFieldError = (fieldName: string, error: string) =>
    set(this.errors, fieldName, error);

  @action public getFieldError = (fieldName: string): string | undefined =>
    get(this.errors, fieldName);

  @action public setHelpers = (helpers: Dictionary<string>) => {
    set(this, "helpers", helpers);
  };

  @action public setFieldHelper = (fieldName: string, value: string) => {
    set(this.helpers, fieldName, value);
  };

  @action public getFieldHelper = (fieldName: string) =>
    get(this.helpers, fieldName);

  @action public setFieldRules = (fieldName: string, rules: string | undefined) => {
    if (isUndefined(rules)) {
      return;
    }
    this.rules = {
      ...this.rules,
      [fieldName]: rules,
    };
  };

  @action public setFieldFinalValidationRules = (fieldName: string, rules: string | undefined) => {
    if (isUndefined(rules)) {
      return;
    }
    this.finalValidationRulse = {
      ...this.finalValidationRulse,
      [fieldName]: rules,
    };
  };

  @action public setValidationAttributeName = (fieldName: string, attrName: string) => {
    this.validationAttributeNames = {
      ...this.validationAttributeNames,
      [fieldName]: attrName,
    };
  };

  @action public validate = (callback?: (valid: boolean) => any, final = false) => {
    if (isUndefined(this.Validator)) {
      return;
    }

    const rules = final ? this.finalValidationRulse : this.getRules();
    const values = omitBy(this.validationValues, (v) => (isString(v) && isEmpty(v)) || (isArray(v) && isEmpty(v)));

    // *TODO: unify validators format
    let validator: any;
    try {
      validator = new this.Validator(values, rules);
    } catch {
      validator = new this.Validator(flatten(this.getValues()), flatten(this.getRules()));
    }
    if (!validator) {
      return;
    }
    this.registerValidator(validator);
    validator.setAttributeNames(this.validationAttributeNames);
    this.errors.clear();
    validator.checkAsync(
      // passes
      () => callback && callback(true),
      () => { // failed
        const errors = validator.errors.all();
        map(errors, (v, k) => this.setFieldError(k, join(v, "\n")));
        callback && callback(false);
      });
  };

  // *NOTE: remove this after it is set in be script
  public registerValidator = (validator: any) => {
    this.Validator.registerAsyncImplicit(
      "required_if_in",
      function(val: string[], req: any, attribute: string, passes) {
        const reqs = req.split(",");
        const reqName = reqs.shift() || "";
        let inputValue = lodashGet(validator.input, reqName);
        // Radio group support
        !isArray(inputValue) && (inputValue = [inputValue]);
        const diff = inputValue && inputValue.filter((inputVal) => {
          try {
            return values(JSON.parse(reqs.join(","))).includes(inputVal);
          }
          catch {
            return reqs.includes(inputVal);
          }
        });
        if (diff && diff.length > 0 && (!val || isEmpty(val))) {
          const { messages: { attributeNames } } = validator;
          // validator message changed according to ENC-5130
          // `The ${attributeNames[attribute]} field is required when ` +
          //  `${attributeNames[reqName]} includes ${reqsAttributes.join(", ")}.`
          // const reqsAttributes = reqs.map((req) => attributeNames[req]);
          return passes(
            false,
            `The ${attributeNames[attribute]} is a required field.`);
        }
        return passes();
      });
  };

  public setFieldAutosave = (name?: string) => {
    if (!name) { return; }
    const inputState = this.inputState.get(name);
    if (!inputState) { return; }
    const formValue = cloneDeep(this.getFieldValue(name));
    inputState.setAutosaveValue(cloneDeep(formValue));
  };
}

export default FBFormState;
