
import { action, observable, set } from "mobx";
import { FBDialogProps } from ".";

export class FBDialogState {
  @observable public open: boolean = false;
  @observable public maxWidth: FBDialogProps["maxWidth"] = "sm";
  @observable public content?: React.ReactNode | string;
  @observable public title?: React.ReactNode | string;
  @observable public actions?: React.ReactNode;

  @action public setDialog = (open: boolean) => {
    set(this, "open", open);
  }

  @action public openDialog = () => {
    this.setDialog(true);
  }

  @action public closeDialog = () => {
    this.setDialog(false);
    // this.config({});
  }

  @action public config = (config: FBDialogProps) => {
    const { maxWidth, title, content, actions } = config;
    this.setMaxWidth(maxWidth);
    this.setTitle(title);
    this.setContent(content);
    this.setActions(actions);
  }

  @action public setMaxWidth = (maxWidth: FBDialogProps["maxWidth"]) => {
    set(this, "maxWidth", maxWidth);
  }

  @action public setContent = (content: React.ReactNode | string) => {
    set(this, "content", content);
  }

  @action public setTitle = (title: React.ReactNode | string) => {
    set(this, "title", title);
  }

  @action public setActions = (actions: React.ReactNode) => {
    set(this, "actions", actions);
  }
}

export default FBDialogState;
