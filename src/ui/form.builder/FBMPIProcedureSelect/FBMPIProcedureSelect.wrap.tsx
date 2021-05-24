import { concat, uniqBy } from "lodash";
import { reaction } from "mobx";
import React from "react";
import { useDispatch } from "react-redux";
import { FB, FBFormState, FBMPIProcedureSelectProps, FBMPIProcedureSelectState, FBMPIProcedureSelectValue, FBProcedureFormActions } from "..";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
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
    const dispatch = useDispatch();
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
          const refs = uniqBy(concat(
            data.smartReferencesTo,
            data.document.smartReferencesTo
          ), "id");
          const partsSelected = refs.reduce((selected, ref) => {
            if (ref?.metadata?.fieldId === name
                && ref.active
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
          id && dispatch(documentRevisionsActions.loadAudit(id));
        }
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      reaction(
        () => mpiProcedureState?.deleteLotApi.data,
        (data?: DocumentRevision) => {
          if (!data) { return; }
          id && dispatch(documentRevisionsActions.loadAudit(id));
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
        unit: unit || initialValues?.unit,
        usedOverride: { id: (usedOverride as DocumentRevision).id },
        type: type.toUpperCase() as "MATERIAL" | "EQUIPMENT",
      };
      mpiProcedureSelectState?.useOverride(id, part);
      mpiProcedureState?.addPartsSelected({
        ...part,
        materialId: initialValues?.id,
        overrideDocId: (usedOverride as DocumentRevision)?.document?.docId,
      });

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
