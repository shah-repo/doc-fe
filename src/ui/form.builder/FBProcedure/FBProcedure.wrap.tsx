import { reaction } from "mobx";
import React from "react";
import { FB, FBProcedureProps, FBProcedureState, FBProcedureValue } from "..";

export const withFBProcedure = <T extends FBProcedureProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAdd,
    removeStep,
    procedureState,
    isPreview,
    isOutput,
    index = 0,
    name,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) as FBProcedureValue;
    procedureState = FB.useRef(FBProcedureState, formValue);
    isOutput = Boolean(workspaceState?.isOutput && workspaceState?.id);
    isPreview = workspaceState?.mode === "preview";

    // MARK: @reactions
    // Value sync with the form
    React.useEffect(() => reaction(
      () => procedureState?.value,
      (data) => formState?.setFieldValue(name, {
        ...formState.getFieldValue(name),
        ...data,
      }, true), {
        fireImmediately: true,
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers

    // MARK: @methods
    handleAdd = (isClone?: boolean) => {
      const newName = FB.uniqid;
      const newItem = {
        ...workspaceState?.getSchemaItemAt(index),
        name: newName,
      };
      if (isClone) {
        formState?.setFieldValue(newName, formState.getFieldValue(name));
      }
      workspaceState?.setSchemaItemAt(newItem, index + 1);
    };

    removeStep = () => {
      formState?.setFieldValue(name, null, true);
      workspaceState?.removeSchemaItemAt(index);
    };

    // MARK: @observer


    return Component({
      ...(props as T),
      handleAdd,
      removeStep,
      procedureState,
      isPreview,
      isOutput,
      index,
      name,
    });
  };

  Comp.displayName = "withFBProcedure";
  return Comp;
};
