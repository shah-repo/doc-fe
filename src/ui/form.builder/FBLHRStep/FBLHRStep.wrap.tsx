import { reaction } from "mobx";
import React from "react";
import { FB, FBLHRStepProps } from "..";

export const withFBLHRStep = <T extends FBLHRStepProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name = "",
    index,
    startMpi,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const schemaItem = workspaceState?.getSchemaItemAt(index);
    const isOutput = Boolean(workspaceState?.isOutput);

    // MARK: @helpers
    React.useEffect(() => {
      formState?.setFieldValue(name, schemaItem?.editorConfig?.value);
      formState?.getInputState(name)?.setRender();
      formState?.validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions
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

    // MARK: @methods
    startMpi = () => {
    };

    // MARK: @observer


    return Component({
      ...(props as T),
      name,
      isOutput,
      startMpi,
    }); };

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
