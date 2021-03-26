import { cloneDeep, concat, get, toNumber, uniqBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBDialogState, FBFormMode, FBMPIProcedureItemProps, FBMPIProcedureSelect, FBMPIProcedureSelectValue, FBProcedureForm, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemType } from "..";
import { DocumentRevision, SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { checkIsDocumentForm } from "../../documentRevision/helpers/checkDocumentGroup";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBMPIProcedureItem = <T extends FBMPIProcedureItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    handleRemove,
    handleSelect,
    handleSelectionDelete,
    getItem,
    getLot,
    loading,
    dialogState,
    multiplier = 1,
    isPreview,
    name,
    type,
    value,
    isOutput,
    isSelectVisible,
    redlineActive,
    ...props
  }: T) => {

    // MARK: @config
    const { mpiProcedureState, workspaceState, formState } = FB.useStores();
    const { document } = workspaceState || {};
    const { documentType } = document?.document || {};
    const isDocumentForm = checkIsDocumentForm(documentType?.groupOptions);

    const smartReferencesTo = uniqBy(concat(
      workspaceState?.document?.smartReferencesTo,
      workspaceState?.document?.document.smartReferencesTo
    ), "id");
    const usedDocumentsInLHRS = workspaceState?.document?.usedDocumentsInLHRS;
    dialogState = FB.useRef(FBDialogState);
    multiplier = toNumber(formState?.getFieldValue("lhr_initial_quantity")) || 1;
    isPreview = isPreview && workspaceState?.mode !== "formPreview";
    // Have to use isDocumentForm instead of isOutput because od MPI
    // ENC-7319
    isSelectVisible = (!isDocumentForm &&
      workspaceState?.mode !== "preview" &&
      workspaceState?.mode !== "formPreview") ||
      redlineActive;

    useEffect(() => {
      if (!mpiProcedureState) { return; }
      setFilteredParts(smartReferencesTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions
    React.useEffect(() => {
      reaction(
        () => mpiProcedureState?.deleteLotApi.data,
        (data?: DocumentRevision) => {
          if (!data) { return; }
          const refs = uniqBy(concat(
            data.smartReferencesTo,
            data.document.smartReferencesTo
          ), "id");
          setFilteredParts(refs);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // MARK: @helpers
    const setFilteredParts = (data) => {
      const partsSelected = data.reduce((selected, ref) => {
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
    };

    // MARK: @methods
    onClick = (part?: FBProcedureItemConfig) => {
      dialogState?.config({
        open: true,
        title: {
          locale: "form.builder.action.mode",
          values: {
            mode: part ? FBFormMode.edit : FBFormMode.add,
            title: `${FBProcedureItemLocale[type]}|s`,
          },
        },
        content: (
          <FBProcedureForm
            {...{ type }}
            initialValues={cloneDeep(part)}
            mode="mpi"
          />
        ),
      });
    };

    handleSelect = (item: FBProcedureItemConfig) => {
      dialogState?.config({
        open: true,
        title: "form.builder.select",
        content: <FBMPIProcedureSelect {...{ name, type }} initialValues={item} />,
      });
    };

    handleSelectionDelete = (refId?: string) => {
      if (!refId) { return; }
      const { id } = workspaceState?.document || {};
      if (!id) { return; }
      mpiProcedureState?.selectionDelete(id, refId);
    };

    handleRemove = (id: string) => mpiProcedureState?.removeItem(id, type);
    getItem = (id: string): string => mpiProcedureState?.getItem(id, type) || "";
    getLot = (id?: string): string => mpiProcedureState?.getLot(id) || "";

    // MARK: @observer
    useObserver(() => {
      // Hack! We should render parts only when data is available
      // We cannot rely on the state api loading value because of the double initialization issue.
      // This should be removed after refactoring and double initialization issue fixed
      if (type === FBProcedureItemType.attachments) { return; }
      if (type === FBProcedureItemType.materials) {
        loading = (
          !FBAutocompleteAsyncStore.data.get(mpiProcedureState?.materialsId || "") ||
          !FBAutocompleteAsyncStore.data.get(mpiProcedureState?.lotsId || "")
        );
      } else {
        loading = !FBAutocompleteAsyncStore.data.get(mpiProcedureState?.equipmentId || "");
      }
      value = get(mpiProcedureState, type);
    });

    return Component({
      ...(props as T),
      onClick,
      handleRemove,
      handleSelect,
      handleSelectionDelete,
      getItem,
      getLot,
      mpiProcedureState,
      isPreview,
      dialogState,
      multiplier,
      loading,
      name,
      type,
      value,
      isSelectVisible,
      usedDocumentsInLHRS,
    });
  };

  Comp.displayName = "withFBMPIProcedureItem";
  return Comp;
};
