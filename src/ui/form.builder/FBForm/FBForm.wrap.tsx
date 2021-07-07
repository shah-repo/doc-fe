import React, { useEffect } from "react";
import { FB, FBFormProps, FBFormState } from "..";

export const withFBForm = <T extends FBFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    initialValues = {},
    workspaceMode = "form",
    errorValidation = true,
    initialValidation = false,
    includeLocking = false,
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
    formState.setIncludeLocking(includeLocking);
    initialValidation && workspaceMode !== "design" && formState.validate();

    useEffect(() => {
      if (!formState) { return; }
      formState.errorValidation = errorValidation;
      formState.workspaceMode = workspaceMode;
    }, [formState, errorValidation, workspaceMode]);

    useEffect(() => {
      if (!formState) { return; }
      formState.initialValues = initialValues;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues]);

    return Component({
      ...(props as T),
      initialValues,
      formState,
      workspaceMode,
      children,
      schema,
      includeLocking,
    });
  };

  return (props: T) => Comp(props);
};
