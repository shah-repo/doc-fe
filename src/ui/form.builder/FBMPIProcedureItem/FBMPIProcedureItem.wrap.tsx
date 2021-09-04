import { cloneDeep, concat, get, uniqBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { FB, FBDialogState, FBFormMode, FBMPIProcedureItemProps, FBMPIProcedureSelect, FBMPIProcedureSelectValue, FBProcedureForm, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemType } from "..";
import { companySelectors } from "../../../state/ducks/company";
import { DocumentRevision, DocumentRevisionStatus, SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { checkIsDocumentForm, checkIsDocumentMPI } from "../../documentRevision/helpers/checkDocumentGroup";
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
    getProcedureLocale,
    getProcedureValues,
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
    isDocumentMPI,
    isReleased,
    ...props
  }: T) => {

    // MARK: @config
    const { mpiProcedureState, workspaceState, formState } = FB.useStores();
    const { document } = workspaceState || {};
    const { version, status } = document || {};
    const { documentType } = document?.document || {};
    const isDocumentForm = checkIsDocumentForm(documentType?.groupOptions);
    isDocumentMPI = checkIsDocumentMPI(documentType?.groupOptions);
    const docRevSmartRef = document?.smartReferencesTo;
    const docSmartRef = document?.document.smartReferencesTo;

    const smartReferencesTo = useMemo(() =>
      uniqBy(concat(
        docSmartRef,
        docRevSmartRef
      ), "id").filter((ref) =>
      ref?.active &&
      ((ref.fromDocRev?.version || 1 ) <= (version || 1))),
    [docRevSmartRef, docSmartRef, version]);

    const usedDocumentsInLHRS = workspaceState?.document?.usedDocumentsInLHRS;
    dialogState = FB.useRef(FBDialogState);
    multiplier = formState?.getFieldValue("lhrs-start-quantity") || 1;
    isPreview = isPreview && workspaceState?.mode !== "formPreview";
    isReleased = status === DocumentRevisionStatus.Released || status === DocumentRevisionStatus.Deprecated;
    // Have to use isDocumentForm instead of isOutput because od MPI
    // ENC-7319
    isSelectVisible = (!isDocumentForm &&
      workspaceState?.mode !== "preview" &&
      workspaceState?.mode !== "formPreview") ||
      redlineActive;
    redlineActive = useSelector(companySelectors.getRedlineActive);

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
        if (ref?.metadata?.fieldId === name
            && ref.active
            && (ref?.type === SmartReferenceType.EquipmentReplacement || ref?.type === SmartReferenceType.LotUsage)) {
          selected.push({
            ...ref?.metadata,
            refId: ref?.id,
            overrideDocId: ref?.toDocRev?.document.docId,
          });
        }
        return selected;
      }, [] as Partial<FBMPIProcedureSelectValue>[]);
      mpiProcedureState?.setPartsSelected(partsSelected);
    };

    function onClose() {
      formState?.unlockField(`${name}.${type}`);
    }

    // MARK: @methods
    onClick = (part?: FBProcedureItemConfig) => {
      dialogState?.config({
        onClose,
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
        content: <FBMPIProcedureSelect {...{ name, type }} initialValues={item} unitDisabled={!!item.unit} />,
      });
    };

    handleSelectionDelete = (refId?: string) => {
      if (!refId) { return; }
      const { id } = workspaceState?.document || {};
      if (!id) { return; }
      mpiProcedureState?.selectionDelete(id, refId);
    };

    getProcedureLocale = (item: FBProcedureItemConfig) => {
      if (isDocumentMPI) {
        return item.type ?
          `form.builder.mpi.procedure.${type}.title.id` :
          `form.builder.mpi.procedure.${type}.title`;
      }
      const usedItem = usedDocumentsInLHRS?.[item.title];
      return usedItem ?
        `form.builder.lhrs.procedure.${type}.title` :
        `form.builder.mpi.procedure.${type}.title`;
    };

    getProcedureValues = (item: FBProcedureItemConfig) => {
      const id = item.id;
      const quantity = item.quantity ? (item.quantity * multiplier) : "form.builder.none";
      const unit = item.unit;
      const usedItem = usedDocumentsInLHRS?.[item.title];
      const revision = usedItem?.displayRevision;

      if (isDocumentMPI) {
        return item.type ?
          { id, title: getItem?.(item.title), quantity, unit } :
          { title: getItem?.(item.title), quantity, unit };
      }

      return usedItem ?
        { title: getItem?.(usedItem?.docRevId), revision, quantity, unit } :
        { title: getItem?.(item.title), quantity, unit };
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
      getProcedureLocale,
      getProcedureValues,
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
      isDocumentMPI,
      redlineActive,
      isReleased,
    });
  };

  Comp.displayName = "withFBMPIProcedureItem";
  return Comp;
};
