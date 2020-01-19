import _ from "lodash";
import React from "react";
import { FBValidationEditorProps } from ".";
import FBValidatorCustom from "../components/validation/FBValidatorCustom";
import FBValidatorForm from "../components/validation/FBValidatorForm";

export const withFBValidationEditor = <T extends FBValidationEditorProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    config,
    ...props
  }: T) => {

    _.isUndefined(config) && (config = [
      {
        title: "form.builder.predefined.validation",
        content: <FBValidatorForm />,
      }, {
        title: "form.builder.custom.validation",
        content: <FBValidatorCustom />,
      },
    ]);

    return Component({
      ...(props as T),
      config,
    });
  };

  return (props: T) => Comp(props);
};
