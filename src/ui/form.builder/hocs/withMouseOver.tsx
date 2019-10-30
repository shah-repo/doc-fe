import { BoxProps } from "@material-ui/core/Box";
import _ from "lodash";
import React from "react";
import { FBEditorSectionConfig } from "../defaults/editor";
import editorStore from "../stores/FBEditorStore";
import sortableStore from "../stores/FBSortableStore";
import formBuilderStore from "../stores/FBStore";
import { FBEditorWrapperProps, FBEditorWrapperSubtractProps } from "../types/editor";

export function withMouseOver<T extends FBEditorWrapperProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<FBEditorWrapperSubtractProps<T>> {

    public state: Pick<BoxProps, "visibility"> = {
      visibility: "hidden",
    };

    public render() {
      return (
        <Component
          {...this.props as T}
          visibility={this.state.visibility}
          indicatorVisibility={this.isIndicatorVisible()}
          toolbarMargin={this.toolbarMargin()}
          indicatorMargin={this.indicatorMargin()}
          removeSchemaItem={this.removeSchemaItem}
          editSchemaItem={this.editSchemaItem}
          // onMouseDown={this.onMouseDown()}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }

    // private onMouseDown = () => () => {

    // }

    private removeSchemaItem = () => {
      formBuilderStore.removeSchemaItem(this.props.index);
    }

    private editSchemaItem = () => {
      editorStore.editorTypeEdit(this.props.index);
    }

    private toolbarMargin = (): number => {
      if (!this.isSection() && this.hasLabel()) {
        return -4;
      }
      return 0;
    }

    private indicatorMargin = (): number => {
      return this.isSection() ? 4 : 0;
    }

    private isSection = (): boolean => {
      return _.includes(FBEditorSectionConfig.section, this.props.type);
    }

    private hasLabel = (): boolean => {
      return this.props.label !== undefined;
    }

    private isIndicatorVisible = (): "visible" | "hidden" =>
      formBuilderStore.mode === "design" ? "visible" : "hidden"

    private onMouseOver = () => {
      if (formBuilderStore.mode === "design" && sortableStore.mode === "inactive") {
        this.setState({ visibility: "visible" });
      }
    }

    private onMouseLeave = () => {
      this.setState({ visibility: "hidden" });
    }
  }
  return HOC;
}
