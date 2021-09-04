import { isEqual, keys, omit } from "lodash";
import { reaction } from "mobx";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FB, FBMediaProps, FBMPIProcedureProps, FBMPIProcedureState, FBProcedureItemType } from "..";
import { companySelectors } from "../../../state/ducks/company";

export const withFBMPIProcedure = <T extends FBMPIProcedureProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAdd,
    onKeyDown,
    mpiProcedureState,
    name = "",
    isInputOwner,
    isOutput,
    isPreview,
    disabled,
    types,
    index = 0,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const schemeItem = workspaceState?.getSchemaItemAt(index);
    mpiProcedureState = FB.useRef(FBMPIProcedureState, schemeItem?.editorConfig);
    const redlineActive = useSelector(companySelectors.getRedlineActive);

    isOutput = Boolean(workspaceState?.isOutput && workspaceState?.id);
    isPreview = (isOutput || workspaceState?.mode === "preview" || workspaceState?.mode === "formPreview") &&
    !redlineActive;
    types = keys(FBProcedureItemType);
    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = (!isInputOwner || isPreview) && !redlineActive;
    const descFormValue = formState?.getFieldValue(`${name}.description`);
    if (!descFormValue) {
      formState?.setFieldValue(`${name}.description`, props.editorConfig?.description);
    }
    // MARK: @reactions
    React.useEffect(() => reaction(
      () => mpiProcedureState?.value,
      (data) => {
        const schemeItem = workspaceState?.getSchemaItemAt(index);
        if (workspaceState && schemeItem) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          workspaceState.schema![index] = {
            ...schemeItem,
            editorConfig: data,
          };
          workspaceState.saveDocRev(formState?.getValues());
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => {
      reaction(
        () => formState?.inputState.get(`${name}.attachments`)?.value,
        (attachments) => {
          if (!mpiProcedureState) { return; }
          const { attachments: stateAttachments } = mpiProcedureState.value || {};
          if (isEqual((attachments as FBMediaProps[]).sort(), (stateAttachments || []).sort())) { return; }
          mpiProcedureState.value = {
            ...mpiProcedureState.value,
            attachments,
          };
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => reaction(
      () => formState?.inputState.get(`${name}.description`)?.value,
      (description) => {
        if (!mpiProcedureState) { return; }
        mpiProcedureState.value = {
          ...mpiProcedureState.value,
          description,
        };
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers


    // MARK: @methods
    handleAdd = (isClone?: boolean, isFromKeys?: boolean) => {
      if (!workspaceState) { return; }
      const newName = FB.uniqid;
      let schemaItem = workspaceState.getSchemaItemAt(index);
      if (!isClone) {
        schemaItem = omit(schemaItem, "editorConfig");
      }
      const newItem = {
        ...schemaItem,
        autoScrollTo: isFromKeys,
        autoFocus: isFromKeys,
        name: newName,
      };
      workspaceState?.setSchemaItemAt(newItem, index + 1);
      workspaceState.saveDocRev(formState?.getValues());
    };

    onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        handleAdd?.(false, true);
      }
    };

    // MARK: @observer

    return Component({
      ...(props as T),
      handleAdd,
      onKeyDown,
      mpiProcedureState,
      isPreview,
      name,
      disabled,
      types,
    });
  };

  Comp.displayName = "withFBMPIProcedure";
  return Comp;
};
