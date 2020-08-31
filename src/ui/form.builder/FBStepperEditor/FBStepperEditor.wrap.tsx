import { isUndefined } from "lodash";
import React from "react";
import { FBStepperEditorProps } from ".";
import { FBValidationEditor, FBValidationMode } from "..";
import editorStore from "../stores/ui/FBEditorStore";

export const withFBStepperEditor = <T extends FBStepperEditorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    children,
    config,
    beforeStepChange,
    ...props
  }: T) => {

    isUndefined(config) && (config = [
      {
        title: "form.builder.field.config",
        content: children,
      }, {
        title: "form.builder.validation",
        content: <FBValidationEditor />,
      }, {
        title: "form.builder.validation.mode",
        content: <FBValidationMode />,
      },
    ]);

    isUndefined(beforeStepChange) && (beforeStepChange =
      (step: number) => editorStore.maxWidth = (step === 1) ? "lg" : "md"
    );

    return Component({
      ...(props as T),
      children,
      config,
      beforeStepChange,
    });
  };

  return (props: T) => Comp(props);
};
