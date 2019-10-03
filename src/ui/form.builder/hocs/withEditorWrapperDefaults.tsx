import { BoxProps } from "@material-ui/core/Box";
import React from "react";
import { formBuilderStore } from "../stores/FBStore";
import { Subtract } from "../types/common";
import { FBEditorWrapperInjectedProps, FBEditorWrapperProps } from "../types/editor";
import { withMouseOver } from "./withMouseOver";

export function withEditorWrapperDefaults<T extends FBEditorWrapperProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBEditorWrapperInjectedProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          editField={this.edit}
          removeField={this.remove}
        />
      );
    }

    private edit = () => {
      alert("edit");
    }

    private remove = () => {
      formBuilderStore.schema.splice(this.props.index, 1);
    }
  }

  return withMouseOver(HOC);
}
