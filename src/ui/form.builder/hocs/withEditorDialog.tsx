import React from "react";
import { Subtract } from "../types/common";
import { FBEditorDialogInjectedProps, FBEditorDialogProps } from "../types/editor";
import { withDialogState } from "./withDialogState";

export function withEditorDialog<T extends FBEditorDialogProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBEditorDialogInjectedProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          handleClick={this.handleClick}
        />
      );
    }

    private handleClick = () => (this.props as T).setDialogOpen();
  }

  return withDialogState(HOC);
}
