// eslint-disable-next-line max-classes-per-file
import { action, observable, set } from "mobx";
import { FBTaskFieldProps } from "..";

class FBTaskFieldState {
  @observable public visibility: FBTaskFieldProps["visibility"] = "hidden";

  @action public setVisibility = (state: boolean) => {
    const visible: FBTaskFieldProps["visibility"] = state ? "visible" : "hidden";
    set(this, "visibility", visible);
  };
}

export default FBTaskFieldState;
