import { reaction } from "mobx";
import React from "react";
import { FB, FBLHRStepProps } from "..";

export const withFBLHRStep = <T extends FBLHRStepProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name = "",
    disabled,
    index,
    ...props
  }: T) => {
    const { workspaceState, formState } = FB.useStores();
    const schemaItem = workspaceState?.getSchemaItemAt(index);
    const isOutput = Boolean(workspaceState?.isOutput);
    disabled = isOutput;

    React.useEffect(() => {
      formState?.setFieldValue(name, schemaItem?.editorConfig?.value);
      formState?.getInputState(name)?.setRender();
      formState?.validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => reaction(
      () => formState?.inputState.get(name)?.value,
      (value) => {
        workspaceState?.setSchemaItem({
          ...schemaItem,
          editorConfig: {
            ...schemaItem?.editorConfig,
            value,
          },
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    return Component({
      ...(props as T),
      name,
      disabled,
    }); };

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
