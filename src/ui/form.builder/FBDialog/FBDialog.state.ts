import { isUndefined } from "lodash";
import { action, observable, set } from "mobx";
import React from "react";
import { FBDialogProps } from "..";

class FBDialogState {
  @observable public open = false;
  @observable public maxWidth: FBDialogProps["maxWidth"] = "sm";
  @observable public content?: React.ReactElement;
  @observable public title?: React.ReactNode | string;
  @observable public actions?: React.ReactNode;

  @action public setDialog = (open: boolean) => {
    set(this, "open", open);
  };

  @action public openDialog = () => {
    this.setDialog(true);
  };

  @action public closeDialog = () => {
    this.reset();
    this.setDialog(false);
  };

  @action public config = (config: FBDialogProps) => {
    this.reset();
    const { maxWidth, title, content, actions, open } = config;
    !isUndefined(open) && this.setDialog(open);
    this.setMaxWidth(maxWidth || this.maxWidth);
    this.setTitle(title || this.title);
    this.setActions(actions || this.actions);
    this.setContent(content || this.content);
  };

  @action public setMaxWidth = (maxWidth: FBDialogProps["maxWidth"]) => {
    set(this, "maxWidth", maxWidth);
  };

  @action public setContent = (content?: React.ReactElement) => {
    set(this, "content", content);
  };

  @action public setTitle = (title: React.ReactNode | string) => {
    set(this, "title", title);
  };

  @action public setActions = (actions: React.ReactNode) => {
    set(this, "actions", actions);
  };

  private reset = () => {
    this.setTitle(undefined);
    this.setContent(undefined);
    this.setActions(undefined);
  };
}

export default FBDialogState;
