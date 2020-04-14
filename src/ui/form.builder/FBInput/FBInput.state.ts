import { action, observable, set } from "mobx";

export class FBInputState {
  @observable public defaultValue: any;
  @observable public value: any;
  @observable public includeContext = false;
  @observable public children: React.ReactElement | undefined;

  @action public setChildren = (children: React.ReactElement) => {
    set(this, "children", children);
  };

  @action public setIncludeContext = (state: boolean) => {
    set(this, "includeContext", state);
  };

  @action public setValue = (value: any) => {
    set(this, "value", value);
  };
}

export default FBInputState;
