
import { action, observable, set } from "mobx";
import { FBDialogProps } from ".";

export class FBDialogState {
  @observable public open = false;
  @observable public maxWidth: FBDialogProps["maxWidth"] = "sm";
  @observable public content?: React.ReactNode | string;
  @observable public title?: React.ReactNode | string;
  @observable public actions?: React.ReactNode;

  @action public setDialog = (open: boolean) => {
    set(this, "open", open);
  };

  @action public openDialog = () => {
    this.setDialog(true);
  };

  @action public closeDialog = () => {
    this.setDialog(false);
  };

  @action public config = (config: FBDialogProps) => {
    const { maxWidth, title, content, actions, open } = config;
    this.setDialog(open || this.open);
    this.setMaxWidth(maxWidth || this.maxWidth);
    this.setTitle(title || this.title);
    this.setContent(content || this.content);
    this.setActions(actions || this.actions);
  };

  @action public setMaxWidth = (maxWidth: FBDialogProps["maxWidth"]) => {
    set(this, "maxWidth", maxWidth);
  };

  @action public setContent = (content: React.ReactNode | string) => {
    set(this, "content", content);
  };

  @action public setTitle = (title: React.ReactNode | string) => {
    set(this, "title", title);
  };

  @action public setActions = (actions: React.ReactNode) => {
    set(this, "actions", actions);
  };
}

export default FBDialogState;
