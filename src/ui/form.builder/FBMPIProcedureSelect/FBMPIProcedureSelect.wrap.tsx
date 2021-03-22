import { reaction } from "mobx";
import React from "react";
import { FB, FBFormState, FBMPIProcedureSelectProps, FBMPIProcedureSelectState, FBMPIProcedureSelectValue, FBProcedureFormActions } from "..";
import { DocumentRevision, SmartReferenceType } from "../../../state/ducks/documentRevisions/types";

export const withFBMPIProcedureSelect = <T extends FBMPIProcedureSelectProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    mpiProcedureSelectState,
    formState,
    initialValues,
    name = "",
    type,
    ...props
  }: T) => {
    // MARK: @config
    const { dialogState, workspaceState, mpiProcedureState } = FB.useStores();
    formState = FB.useRef<FBFormState>(FBFormState, {});
    mpiProcedureSelectState = FB.useRef(FBMPIProcedureSelectState, initialValues?.id);
    const { id } = workspaceState || {};

    React.useEffect(() => {
      dialogState?.setActions(
        <FBProcedureFormActions {...{ handleAdd, handleCancel }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions
    // MARK: @reactions
    React.useEffect(() => {
      reaction(
        () => mpiProcedureSelectState?.useOverrideApi.data,
        (data?: DocumentRevision) => {
          if (!data) { return; }
          const partsSelected = data.smartReferencesTo?.reduce((selected, ref) => {
            if (ref.metadata?.fieldId === name
                && (ref.type === SmartReferenceType.EquipmentReplacement || ref.type === SmartReferenceType.LotUsage)) {
              selected.push({
                ...ref.metadata,
                refId: ref.id,
                overrideDocId: ref.toDocRev?.document.docId,
              });
            }
            return selected;
          }, [] as Partial<FBMPIProcedureSelectValue>[]);
          mpiProcedureState?.setPartsSelected(partsSelected);
        }
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @helpers
    function handleAdd() {
      if (!id) { return; }
      const formValue = formState?.getValues() as FBMPIProcedureSelectValue;
      const { quantity, unit, usedOverride } = formValue;
      const part = {
        fieldId: name,
        forPreselected: { id: initialValues?.id },
        quantity,
        unit,
        usedOverride,
        type: type.toUpperCase() as "MATERIAL" | "EQUIPMENT",
      };
      mpiProcedureSelectState?.useOverride(id, part);
      handleCancel?.();
    }

    function handleCancel() {
      dialogState?.closeDialog();
    }

    // MARK: @methods

    return Component({
      ...(props as T),
      mpiProcedureSelectState,
      formState,
      initialValues,
      name,
      type,
    });
  };

  Comp.displayName = "withFBMPIProcedureSelect";
  return Comp;
};
