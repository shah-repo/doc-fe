import React from "react";
import { FBFormProps, FBFormState } from ".";
import { FB } from "..";

export const withFBForm = <T extends FBFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    initialValues = {},
    workspaceMode = "form",
    errorValidation = true,
    formState,
    schema,
    children,
    ...props
  }: T) => {

    formState = FB.useRef<FBFormState>(FBFormState);
    formState?.setInitialValues(initialValues);
    formState && (formState.errorValidation = errorValidation);

    return Component({
      ...(props as T),
      initialValues,
      formState,
      workspaceMode,
      children,
      schema,
    });
  };

  return (props: T) => Comp(props);
};
