import { cloneDeep } from "lodash";
import { action, observable, set } from "mobx";
import { FBInputConstructor, FBInputType } from ".";

export class FBInputState {
  public static omitLabel: FBInputType[] = ["checkbox", "radio", "hyperlink", "section"];
  // Set value on blur
  public static omitOnChange: FBInputType[] = ["textfield", "texteditor"];
  public autosavePrevValue?: any;
  @observable public value: any;
  @observable public includeContext = false;
  @observable public children: React.ReactElement | undefined;
  @observable public autosaveNextValue?: any;
  @observable public hidden?: boolean;

  public constructor({ value, hidden }: FBInputConstructor) {
    this.value = value;
    this.hidden = hidden;
  }

  @action public setChildren = (children: React.ReactElement) => {
    set(this, "children", children);
  };

  @action public setAutosaveValue = (value: any) => {
    this.autosavePrevValue = this.autosaveNextValue;
    set(this, "autosaveNextValue", cloneDeep(value));
  };

  @action public setIncludeContext = (state: boolean) => {
    set(this, "includeContext", state);
  };

  @action public setValue = (value: any) => {
    set(this, "value", value);
  };

  @action public setHidden = (state: boolean) => {
    set(this, "hidden", state);
  };
}

export default FBInputState;
