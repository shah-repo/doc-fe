import Box from "@material-ui/core/Box";
import React from "react";
import FBDialog from "../components/feedback/FBDialog";
import FBForm from "../components/form/FBForm";
import { formBuilderStore } from "../stores/FBStore";
import { Subtract } from "../types/common";
import { FBDialogProps } from "../types/dialog";
import { FBEditorWrapperInjectedProps, FBEditorWrapperProps } from "../types/editor";
import { withDialogState } from "./withDialogState";
import { withEditorRenderer } from "./withEditorRenderer";
import { withMouseOver } from "./withMouseOver";

export function withEditorWrapperDefaults<T extends FBEditorWrapperProps & FBDialogProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBEditorWrapperInjectedProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          editField={this.edit}
          removeField={this.remove}
        >
          <FBDialog {...this.props as FBDialogProps}>
            <Box display="block" p={2} />
          </FBDialog>
          {this.props.children}
        </Component>
      );
    }

    private edit = () => {
      const schema = formBuilderStore.schema[this.props.index];
      const { type } = schema;

      this.props.setDialogContent(
        <FBForm
          initialValues={schema}
          render={withEditorRenderer({type, ...this.props})}
        />,
        "form.builder.edit.field",
      );
      this.props.setDialogOpen();
    }

    private remove = () => {
      formBuilderStore.schema.splice(this.props.index, 1);
    }
  }

  return withMouseOver(withDialogState(HOC));
}
