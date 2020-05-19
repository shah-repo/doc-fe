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
    initialValidation = false,
    formState,
    schema,
    children,
    ...props
  }: T) => {

    !formState && (formState = FB.useRef<FBFormState>(FBFormState, { schema, initialValues, workspaceMode }));
    formState && (formState.errorValidation = errorValidation);

    React.useEffect(() => {
      initialValidation && formState && workspaceMode !== "design" && formState.validate();
    }, [initialValidation, formState, workspaceMode]);

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
