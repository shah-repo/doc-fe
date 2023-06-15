import { isUndefined } from 'lodash';
import { action, computed, observable, set } from 'mobx';
import React from 'react';
import { FBDialogProps } from '..';

class FBLeftPanelState {
  @observable public open = false;
  @observable public index = 0;
  @observable public showLeftPanelEditor = false;
  @observable public maxWidth: FBDialogProps['maxWidth'] = 'sm';
  @observable public content?: React.ReactElement;
  @observable public title?: React.ReactNode | string;
  @observable public actions?: React.ReactNode;
  public props?: FBDialogProps;

  @action public setDialog = (open: boolean) => {
    set(this, 'open', open);
  };

  @action public setIndex = (index: number) => {
    set(this, 'index', index);
  };
  @computed public get getIndex(): number {
    return this.index;
  }

  @action public setShowLeftPanelEditor = (open: boolean) => {
    set(this, 'showLeftPanelEditor', open);
  };

  @action public openDialog = () => {
    this.setDialog(true);
  };

  @action public closeDialog = () => {
    this.HideLeftPanel();
  };
  @action public HideLeftPanel = () => {
    this.reset();
    this.setDialog(false);
    this.setShowLeftPanelEditor(false);
  };

  @action public config = (config: FBDialogProps) => {
    this.reset();
    this.props = config;
    const { maxWidth, title, content, actions, open, showLeftPanelEditor } = config;
    !isUndefined(open) && this.setDialog(open);
    !isUndefined(showLeftPanelEditor) && this.setShowLeftPanelEditor(showLeftPanelEditor);
    this.setMaxWidth(maxWidth || this.maxWidth);
    this.setTitle(title || this.title);
    this.setActions(actions || this.actions);
    this.setContent(content || this.content);
  };

  @action public setMaxWidth = (maxWidth: FBDialogProps['maxWidth']) => {
    set(this, 'maxWidth', maxWidth);
  };

  @action public setContent = (content?: React.ReactElement) => {
    set(this, 'content', content);
  };

  @action public setTitle = (title: React.ReactNode | string) => {
    set(this, 'title', title);
  };

  @action public setActions = (actions: React.ReactNode) => {
    set(this, 'actions', actions);
  };

  private reset = () => {
    this.setTitle(undefined);
    this.setContent(undefined);
    this.setActions(undefined);
  };
}

export default FBLeftPanelState;
