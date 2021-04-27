import { keys, omit } from "lodash";
import { reaction } from "mobx";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FB, FBMPIProcedureProps, FBMPIProcedureState, FBProcedureItemType } from "..";
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
    const formValue = formState?.getFieldValue(`${name}.description`);
    if (!formValue) {
      formState?.setFieldValue(`${name}.description`, props.editorConfig?.description);
    }

    // MARK: @reactions
    React.useEffect(() => reaction(
      () => mpiProcedureState?.value,
      (data) => {
        formState?.setFieldValue(`${name}.description`, data?.description, false);
      }, {
        fireImmediately: true,
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => mpiProcedureState?.value,
      (data) => {
        if (!formValue) {
          formState?.setFieldValue(`${name}.description`, data?.description, false);
        }
        workspaceState?.setSchemaItem({
          ...schemeItem,
          editorConfig: {
            ...data,
            materials: data?.materials?.map((material) => omit(material, "LHRTparameter")),
            equipment: data?.equipment?.map((eq) => omit(eq, "LHRTparameter")),
          },
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => {
      reaction(
        () => formState?.inputState.get(`${name}.attachments`)?.value,
        (data) => {
          if (workspaceState && workspaceState?.getSchemaItemAt(index)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            workspaceState.schema![index] = {
              ...schemeItem,
              editorConfig: {
                ...schemeItem?.editorConfig,
                attachments: data,
              },
            };
          }
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => reaction(
      () => formState?.inputState.get(`${name}.description`)?.value,
      (description) => {
        if (!workspaceState) { return; }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        workspaceState.schema![index] = {
          ...schemeItem,
          editorConfig: {
            ...schemeItem?.editorConfig,
            description,
          },
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
