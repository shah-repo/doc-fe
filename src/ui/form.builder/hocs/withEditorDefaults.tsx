import React from "react";
import FBForm from "../components/form/FBForm";
import FBButton from "../components/inputs/FBButton";
import { FBEditorSectionConfig } from "../defaults/editor";
import FBEditorSection from "../main/editor/FBEditorSection";
import { Subtract } from "../types/common";
import {
  FBEditorElementType,
  FBEditorSectionInjectedProps,
  FBEditorSectionProps,
} from "../types/editor";
import { withDialogState } from "./withDialogState";
import { withEditorRenderer } from "./withEditorRenderer";

export function withEditorDefaults<T extends FBEditorSectionProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBEditorSectionInjectedProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          generateSections={this.generateSections}
        />
      );
    }

    private generateElements = (elements: FBEditorElementType[]) => elements.map((el) => (
      <FBButton
        label={`form.builder.${el as string}`}
        onClick={this.handleFieldType(el)}
      />
    ))

    private generateSections = () => Object.keys(FBEditorSectionConfig).map((key) => (
      <FBEditorSection label={`form.builder.${key as string}`}>
        {this.generateElements(FBEditorSectionConfig[key])}
      </FBEditorSection>
    ))

    private handleFieldType = (type: FBEditorElementType) => () => {
      this.props.setDialogChildren(
        <FBForm render={withEditorRenderer({type, ...this.props})} />,
      );
      this.props.setDialogOpen();
    }
  }
  return withDialogState(HOC);
}
