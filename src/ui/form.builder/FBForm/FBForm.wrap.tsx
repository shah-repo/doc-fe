import React, { useMemo } from "react";
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

    useMemo(() => {
      formState?.setInitialValues(initialValues);
    }, [initialValues, formState]);

    React.useEffect(() => {
      if (!formState) { return; }
      formState.errorValidation = errorValidation;
      initialValidation && workspaceMode !== "design" && formState.validate();
    }, [initialValidation, formState, workspaceMode, initialValues, errorValidation]);

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
