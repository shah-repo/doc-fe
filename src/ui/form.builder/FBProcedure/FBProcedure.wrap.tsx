import { keys } from "lodash";
import { reaction } from "mobx";
import React from "react";
import { FB, FBProcedureItemType, FBProcedureProps, FBProcedureState, FBProcedureValue } from "..";

export const withFBProcedure = <T extends FBProcedureProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAdd,
    procedureState,
    isPreview,
    isOutput,
    index = 0,
    types,
    name,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) as FBProcedureValue;
    procedureState = FB.useRef(FBProcedureState, formValue);
    isOutput = Boolean(workspaceState?.isOutput && workspaceState?.id);
    isPreview = workspaceState?.mode === "preview";
    types = keys(FBProcedureItemType);

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

    // MARK: @observer

    return Component({
      ...(props as T),
      handleAdd,
      procedureState,
      isPreview,
      isOutput,
      types,
      index,
      name,
    });
  };

  Comp.displayName = "withFBProcedure";
  return Comp;
};
