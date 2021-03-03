import { SnackbarOrigin } from "@material-ui/core";
import { action, observable, set } from "mobx";
import { FBSnackbarProps } from "..";

class FBSnackbarState {
  @observable public open = false;
  @observable public message?: string;
  @observable public action?: React.ReactNode;
  @observable public anchorOrigin?: SnackbarOrigin = { vertical: "top", horizontal: "right" };

  @action public setOpen = (open: boolean) => set(this, "open", open);
  @action public setMessage = (message?: string) => set(this, "message", message);
  @action public setAction = (action?: React.ReactNode) => set(this, "action", action);
  @action public setAnchorOrigin = (anchorOrigin?: SnackbarOrigin) => set(this, "anchorOrigin", anchorOrigin);

  @action public config = (config: Partial<FBSnackbarProps>) => {
    const { open, message, anchorOrigin, action } = config;
    this.setOpen(open || this.open);
    this.setMessage(message || this.message);
    this.setAnchorOrigin(anchorOrigin || this.anchorOrigin);
    this.setAction(action || this.action);
  };

}

export default FBSnackbarState;
