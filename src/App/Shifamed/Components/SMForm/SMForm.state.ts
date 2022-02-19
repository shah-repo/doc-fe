import { get, isEmpty, isString, isUndefined, join, map, omitBy } from "lodash";
import { action, computed, observable, set } from "mobx";
import * as Validator from "validatorjs";
import { SMFormProps, SMFormStateProps } from "../../..";
import { SmartReferenceType } from "../../../../state/ducks/documentRevisions/types";
import { FBLHRBuildOptions, FBWorkspaceMode } from "../../../../ui/form.builder";

class SMFormState implements SMFormStateProps {
  @observable public render = false;
  // MARK: @config

  /**
   * @cfg {Map<input name, input value>} Next values for each input in the form.
   * Add reaction on this props when you want to rerender the input.
   */
  // @observable public newValues = new Map<string, any>();

  /**
   * @cfg {Record<input name, input value>} Prev state of values for each input in the form.
   */
  public oldValues: SMFormProps["values"] = {};

  /**
   * @cfg {Record<input name, input value>} Validation values.
   * Values we want to include in validation process.
   */
  public validationValues: SMFormProps["values"] = {};
  public validationAttributeNames: Record<string, string> = {};
  public rules: Record<string, any> = {};

  // MARK: @observables
  /**
   * @cfg {boolean} loading flag.
   */
  @observable public loading = false;
  /**
   * @cfg {Record<input name, input value>} Form values.
   * Final values prepared for preserving.
   */
  @observable public values = new Map<string, any>();

  /**
   * @cfg {Map<input name, error msg>} Error msg for each input in the form.
   * Error msg change will rerender input error label.
   */
  @observable public errors = new Map<string, string>();

  /**
   * @cfg {Mapinput name, hidden state} Hidden state for each input in the form.
   * Set true to omit the input.
   */
  @observable public hidden = new Map<string, boolean>();

  /**
   * @cfg {boolean} Mark form as dirty.
   */
  @observable public isDirty = false;

  /**
   * @cfg {boolean} If true fire autosave on form values change.
   */
  @observable public autosave = false;

  /**
   * @cfg {FBWorkspaceMode} Layout form mode.
   */
  @observable public mode: FBWorkspaceMode = "none";

  // MARK: @constructor

  // MARK: @computed
  @computed public get active(): boolean {
    return this.mode !== "none";
  }

  @computed public get Validator(): any {
    return get(window, "EnlilRemoteValidators.validator") || Validator;
  }

  // MARK: @actions
  @action public setMode = (mode: FBWorkspaceMode) => {
    set(this, "mode", mode);
  };

  @action public setDirty = (isDirty: boolean) => {
    set(this, "isDirty", isDirty);
  };

  @action public setAutosave = (autosave: boolean) => {
    set(this, "autosave", autosave);
  };

  @action public setValues = (values?: SMFormProps["values"]) => {
    map(values, (v, k) => this.values.set(k, v));
  };

  @action public setLoading = (loading?: boolean) => {
    set(this, "loading", loading || false);
  };

  // MARK: @helpers
  public get isLHRProductionBuild(): boolean {
    const refs = this.getValue("smartReferencesTo");
    return refs?.filter(
      (ref) => ref.active && ref.type === SmartReferenceType.HiddenPiInstance)[0]?.
      toDocRev?.formInput?.["lhr-build-type"] === FBLHRBuildOptions.Production;
  }

  public setValue = (
    name?: string,
    value?: any,
  ) => {
    if (!name) { return; }
    if (this.oldValues) {
      this.oldValues[name] = this.values.get(name);
    }

    this.values.set(name, value);
  };

  public getValue = (name?: string): any => {
    if (!name) { return; }
    return this.values.get(name);
  };

  public setRule = (name: string, rules: string) => {
    this.rules = {
      ...this.rules,
      [name]: rules,
    };
  };

  public getRules = () => this.rules;
  public getValues = (): Record<string, any> => Object.fromEntries(this.values);

  public validate = (callback?: (valid: boolean) => any) => {
    if (isUndefined(this.Validator)) { return; }

    const rules = this.getRules();
    const values = omitBy(this.values, (v) => isString(v) && isEmpty(v));

    const validator = new this.Validator(values, rules);
    validator.setAttributeNames(this.validationAttributeNames);
    this.errors.clear();
    validator.checkAsync(
      () => callback && callback(true), // passes
      () => { // failed
        const errors = validator.errors.all();
        map(errors, (v, k) => this.errors.set(k, join(v, "\n")));
        callback && callback(false);
      });
  };
}

export default SMFormState;
