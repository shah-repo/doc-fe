import React, { useEffect } from "react";
import { FBFormProps, FBFormState } from ".";
import { FB } from "..";

export const withFBForm = <T extends FBFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    initialValues = {},
    workspaceMode = "form",
    errorValidation = true,
    initialValidation = false,
    formState,
    schema,
    children,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    !formState && (formState = FB.useRef<FBFormState>(FBFormState, {
      schema,
      initialValues,
      workspaceMode,
      workspaceState,
    }));
    initialValidation && workspaceMode !== "design" && formState.validate();

    useEffect(() => {
      if (!formState) { return; }
      formState.errorValidation = errorValidation;
      formState.workspaceMode = workspaceMode;
    }, [formState, errorValidation, workspaceMode]);

    useEffect(() => {
      formState?.setValues(initialValues);
    }, [initialValues]);

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
