import { BoxProps } from "@material-ui/core/Box";
import _ from "lodash";
import React from "react";
import { FBEditorSectionConfig } from "../defaults/editor";
import sortableStore from "../stores/ui/FBSortableStore";
import FBStore from "../stores/ui/FBStore";
import {
  FBEditorWrapperProps,
  FBEditorWrapperSubtractProps,
} from "../types/editor";

export function withEditorWrapper<T extends FBEditorWrapperProps>(
  Component: React.ComponentType<T>,
) {
  class HOC extends React.Component<FBEditorWrapperSubtractProps<T>> {
    public state: Pick<BoxProps, "visibility"> & { mdHidden: boolean } = {
      visibility: "hidden",
      mdHidden: true,
    };

    public render() {
      return (
        <Component
          {...(this.props as T)}
          visibility={this.state.visibility}
          mdHidden={this.state.mdHidden}
          schemaItem={FBStore.getSchemaItem(this.props.index)}
          indicatorVisibility={this.isIndicatorVisible()}
          toolbarMargin={this.toolbarMargin()}
          indicatorMargin={this.indicatorMargin()}
          removeSchemaItem={this.removeSchemaItem}
          mdSchemaItem={this.mdSchemaItem}
          editSchemaItem={this.editSchemaItem}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }

    private removeSchemaItem = () => {
      FBStore.removeSchemaItem(this.props.index);
    }

    private editSchemaItem = () => {
      FBStore.editSchemaItem(this.props.index);
    }

    private mdSchemaItem = () => {
      this.setState({ mdHidden: !this.state.mdHidden });
    }

    private toolbarMargin = (): number => {
      if (!this.isSection() && this.hasLabel()) {
        return -4;
      }
      return 0;
    }

    private indicatorMargin = (): number => {
      return this.isSection() || !this.hasLabel() ? 4 : 0;
    }

    private isSection = (): boolean =>
      _.includes(FBEditorSectionConfig.section, this.props.type)

    private hasLabel = (): boolean => this.props.label !== undefined;

    private canBeVisible = (): boolean => {
      return FBStore.mode === "design" && sortableStore.mode === "inactive";
    }

    private isIndicatorVisible = (): "visible" | "hidden" => {
      return FBStore.mode === "design" ? "visible" : "hidden";
    }

    private onMouseOver = () => {
      if (!this.canBeVisible()) {
        return;
      }
      this.setState({ visibility: "visible" });
    }

    private onMouseLeave = () => this.setState({ visibility: "hidden" });
  }
  return HOC;
}
