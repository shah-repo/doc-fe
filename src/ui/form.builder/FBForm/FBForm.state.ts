import { flatten, unflatten } from 'flat';
import { cloneDeep, Dictionary, get as lodashGet, isArray, isBoolean, isEmpty, isNumber, isString, isUndefined, join, map, omit, omitBy, set as lodashSet, slice, toNumber, values } from 'lodash';
import { action, computed, get, observable, set } from 'mobx';
import { FBFormConstructor, FBInputState, FBLockBody, FBLockValue, FBValidationRelatedRules, FBWorkspaceMode, FBWorkspaceSkipValidationModes, FBWorkspaceState } from '..';
import FBSchemaState from '../FBSchema/FBSchema.state';

class FBFormState extends FBSchemaState {
  public rules: Dictionary<string> = {};
  public validationAttributeNames: Dictionary<string> = {};
  public errorValidation = true;
  public initialValues: Dictionary<any> = {};
  public workspaceMode?: FBWorkspaceMode;
  public values: Dictionary<any> = {};
  public validationValues: Dictionary<any> = {};
  private finalValidationRulse: Dictionary<string> = {};
  public validatorRules: Record<string, FBValidationRelatedRules[]> = {};
  public validationRelatedRules: Record<string, FBValidationRelatedRules[]> = {};
  public includeLocking = false;
  public expireLocks: Record<string, string> = {};

  // This will be used for reaction on value change
  // so that we can omit Input state
  @observable public newValues = new Map<string, any>();
  public oldValues = {};

  // Naming? Don't know, don't ask!
  @observable isBackdropOpen = false;

  // TO BBE REMOVED!
  public workspaceState?: FBWorkspaceState;
  @observable public errors = new Map<string, string>();
  @observable public helpers = new Map<string, string>();
  @observable public inputState = new Map<string, FBInputState>();
  @observable public locked = new Map<string, FBLockValue>();
  @observable public approvalMap = {};

  public constructor({
    schema,
    initialValues = {},
    workspaceMode, workspaceState,
  }: FBFormConstructor) {
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
    return lodashGet(window, 'EnlilRemoteValidators.validator');
  }

  public get shouldValidate(): boolean {
    return !FBWorkspaceSkipValidationModes.some((mode) => this.workspaceMode === mode);
  }

  public setIncludeLocking = (state: boolean) => {
    this.includeLocking = state;
  };

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
    lodashSet(this.validationValues, fieldName, cloneDeep(value));
  };

  @action public setFieldValue = (
    fieldName: string | undefined,
    value: any,
    withState = false,
    omitFormValue = false,
  ) => {
    if (!fieldName) { return; }
    value = cloneDeep(value);
    this.newValues.set(fieldName, value);
    this.oldValues = cloneDeep(this.values);
    if (!omitFormValue) {
      lodashSet(this.values, fieldName, value);
    }
    this.setValidationValue(fieldName, value);
    if (!withState) { return; }
    this.inputState.get(fieldName)?.setValue(value);
  };

  @action public omitFieldValue = (fieldName?: string) => {
    if (!fieldName) {
      return;
    }
    this.newValues.set(fieldName, undefined);
    this.initialValues = omit(this.initialValues, fieldName);
    this.values = omit(this.getValues(), fieldName);
    this.validationValues = omit(this.validationValues, fieldName);
    this.inputState.get(fieldName)?.setValue(undefined);
  };

  @action public setApprovalMap = (approvals) => {
    set(this, 'approvalMap', { ...this.approvalMap, ...approvals });
  };
  @action public setRules = (rules: Dictionary<string>) =>
    set(this.rules, rules);

  @action public getRules = () => this.rules;

  @action public setErrors = (errors: Dictionary<string>) =>
    set(this, 'errors', errors);

  @action public setFieldError = (fieldName: string, error: string) =>
    set(this.errors, fieldName, error);

  @action public getFieldError = (fieldName: string): string | undefined =>
    get(this.errors, fieldName);

  @action public setHelpers = (helpers: Dictionary<string>) => {
    set(this, 'helpers', helpers);
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

  @action public removeFieldRules = (fieldName: string) => {
    const rules = { ...this.rules };
    const finalValidationRulse = { ...this.finalValidationRulse };
    if (isUndefined(rules[fieldName]) || isUndefined(finalValidationRulse[fieldName])) {
      return;
    }
    delete rules[fieldName];
    delete finalValidationRulse[fieldName];
    this.rules = {
      ...rules,
    };
    this.finalValidationRulse = {
      ...finalValidationRulse,
    };
  };

  @action public validate = (callback?: (valid: boolean) => any, final = false) => {
    if (isUndefined(this.Validator)) {
      return;
    }

    let rules = final ? this.finalValidationRulse : this.getRules();
    let values = omitBy(this.validationValues, (v) => (isString(v) && isEmpty(v)) || (isArray(v) && isEmpty(v)));

    // *TODO: unify validators format
    let validator: any;
    try {
      validator = new this.Validator(values, rules);
    } catch {
      rules = flatten(this.getRules());
      values = flatten(this.getValues());
    }
    if (!validator) {
      return;
    }
    this.validatorRules = validator.rules;
    validator = new this.Validator(values, this.parseRules(rules, values));
    this.registerValidator(validator);
    validator.setAttributeNames(this.validationAttributeNames);
    this.errors.clear();
    validator.checkAsync(
      // passes
      () => callback && callback(true),
      () => { // failed
        const errors = validator.errors.all();
        map(errors, (v, k) => this.setFieldError(k, join(v, '\n')));
        callback && callback(false);
      });
  };

  private parseRules = (rules: Dictionary<string>, values: Dictionary<string>): Dictionary<string> => {
    const parsedRules = {};
    map(rules, (value, key) => {
      if (!isString(value)) { return; }
      const rulesArray = value?.split('|');
      const valuesArray: any = [];
      map(rulesArray, (val) => {
        if (!val) {
          return;
        }
        const splitVal = val.split(':');
        if (splitVal.length === 1) {
          parsedRules[key] = val;
        } else {
          const finalValue = splitVal[1].split(',');
          if (finalValue.length === 1) {
            valuesArray.push({
              [splitVal[0]]: finalValue[0],
            });
          } else if (splitVal.length === 2) {
            let fromValue: any = values[finalValue[0]];
            fromValue = isNumber(fromValue) ? toNumber(finalValue[1]) : finalValue[1];
            valuesArray.push({
              [splitVal[0]]: [finalValue[0], fromValue],
            });
          } else { // array value (required_if_in validator)
            // const ruleName = splitVal[1].split(",")[0];
            const splitArray = splitVal[1].split(',');
            const splitValue = val.split(',');
            const finalValue = slice(splitValue, 1, splitValue.length).join(',');
            valuesArray.push({
              [splitVal[0]]: [splitArray[0], finalValue],
            });
          }
          parsedRules[key] = valuesArray;
        }
      });
    });
    return parsedRules;
  };

  // *NOTE: remove this after it is set in be script
  public registerValidator = (validator: any) => {
    this.Validator.registerAsyncImplicit(
      'required_if_in',
      function(val: string[], req: string[], attribute: string, passes) {
        const reqs = req?.[1];
        const reqName = req?.[0] || '';
        let inputValue = lodashGet(validator.input, reqName);
        // Radio group support
        !isArray(inputValue) && (inputValue = [inputValue]);
        const diff = inputValue && inputValue.filter((inputVal) => {
          try {
            return values(JSON.parse(reqs)).includes(inputVal);
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
    this.Validator.registerAsyncImplicit(
      'required_if',
      function(val: string[], req: string[], attribute: string, passes) {
        const reqs = req?.[1];
        const reqName = req?.[0] || '';
        const inputValue = lodashGet(validator.input, reqName);
        const { messages: { attributeNames } } = validator;
        if (!inputValue) {  return passes(); }
        if (!val)
        { return passes(
          false,
          `The ${attributeNames[attribute]} field is required when ${attributeNames[reqName]} is 
          ${attributeNames[reqs]}`); }

        return passes();

      });

  };

  public setFieldAutosave = (name?: string) => {
    if (!name) { return; }
    const inputState = this.inputState.get(name);
    if (!inputState) { return; }
    const formValue = cloneDeep(this.getFieldValue(name));
    inputState.setAutosaveValue(formValue);
  };

  public lockField = (
    body: Partial<FBLockBody>,
    fieldName: string
  ) => {
    // if (!this.includeLocking) { return; }
    // if (this.locked?.get(fieldName)?.locked) { return; }
    // set(this, "isBackdropOpen", true);
    // this.locked.set(fieldName, {
    //   ...this.locked.get(fieldName),
    //   fieldName,
    // });
    // SMStore.post<FBLockData, Partial<FBLockBody>>({
    //   url: SMUrl.lockFields,
    //   body,
    // }, (data, error) => {
    //   if (error) {
    //     const { statusCode } = error || {};
    //     if (!statusCode || statusCode === 500) { return; }
    //   }
    //   const {
    //     lock: { id = undefined } = {},
    //     documentRevision: { owner: { user: { email: ownerName = undefined } = {} } = {} } = {},
    //   } = data || {};
    //   if (!id) {
    //     set(this, "isBackdropOpen", false);
    //     return;
    //   }
    //   this.locked.set(fieldName, {
    //     ...this.locked.get(fieldName),
    //     locked: true,
    //     fieldName,
    //     lockId: id,
    //     ownerName: ownerName || this.workspaceState?.currentUser?.email,
    //   });
    //   set(this, "isBackdropOpen", false);
    // });
  };

  public unlockField = (fieldName?: string) => {
    // if (!this.includeLocking) { return; }
    // if (!fieldName) { return; }
    // const lockedData = this.locked.get(fieldName);
    // const { lockId: id } = lockedData || {};
    // if (!id || isEmpty(id)) { return; }

    // SMStore.post({
    //   url: SMStore.templateUrl(SMUrl.lockFieldsExpire, { id }),
    // }, (_data, error) => {
    //   if (error) {
    //     return;
    //   }
    //   this.locked.set(fieldName, {
    //     ...lockedData,
    //     locked: false,
    //     lockId: undefined,
    //   });
    // });
  };
}

export default FBFormState;
