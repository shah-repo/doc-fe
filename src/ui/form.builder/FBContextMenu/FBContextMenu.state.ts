import { PopoverPosition } from "@material-ui/core";
import { action, computed, observable, set } from "mobx";

class FBContextMenuState {
  @observable public mouseX: number | undefined;
  @observable public mouseY: number | undefined;

  @computed public get anchorPosition(): PopoverPosition {
    return { top: this.mouseY || 0, left: this.mouseX || 0 };
  }

  @action public setPosition = (top: number | undefined = undefined, left: number | undefined = undefined) => {
    set(this, "mouseX", left);
    set(this, "mouseY", top);
  };
}

export default FBContextMenuState;
