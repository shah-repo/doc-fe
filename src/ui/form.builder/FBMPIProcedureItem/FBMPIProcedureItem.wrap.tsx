import { cloneDeep, concat, get, uniqBy } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FB, FBDialogState, FBFormMode, FBMPIProcedureItemProps, FBMPIProcedureSelect, FBMPIProcedureSelectValue, FBProcedureForm, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemType } from "..";
import { companySelectors } from "../../../state/ducks/company";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
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
    isDateOverdue,
    loading,
    dialogState,
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
    const dispatch = useDispatch();
    const [lhrsQuantity, setLhrsQuantity] = useState(1);
    const { mpiProcedureState, workspaceState, formState } = FB.useStores();
    const { document, id } = workspaceState || {};
    const { version, status } = document || {};
    const { documentType } = document?.document || {};
    const isDocumentForm = checkIsDocumentForm(documentType?.groupOptions);
    isDocumentMPI = checkIsDocumentMPI(documentType?.groupOptions);
    const isDocPIInstance = document?.document.documentType.group === DOC_TYPE_GROUP.PI_INSTANCE;
    const docRevSmartRef = document?.smartReferencesTo;
    const docSmartRef = document?.document.smartReferencesTo;
    const smartRef = isDocPIInstance ? docRevSmartRef : uniqBy(concat(docSmartRef, docRevSmartRef), "id");

    const smartReferencesTo = useMemo(() =>
      smartRef?.filter((ref) =>
      ref?.active &&
      ((ref.fromDocRev?.version || 1 ) <= (version || 1))),
    [smartRef, version]);
    const usedDocumentsInLHRS = workspaceState?.document?.usedDocumentsInLHRS;
    dialogState = FB.useRef(FBDialogState);
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

      if (!mpiProcedureState || !smartReferencesTo) { return; }
      setFilteredParts(smartReferencesTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions

    React.useEffect(() => {
      reaction(
        () => formState?.getInputState("lhrs-start-quantity")?.value,
        (data?: DocumentRevision) => {
          if (!data) { return; }
          const formValue = cloneDeep(formState?.getFieldValue("lhrs-start-quantity"));
          setLhrsQuantity(formValue);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      reaction(
        () => mpiProcedureState?.deleteLotApi.data,
        (data?: DocumentRevision) => {
          if (!data) { return; }
          const refs = isDocPIInstance ?
            data.smartReferencesTo :
            uniqBy(concat(data.smartReferencesTo, data.document.smartReferencesTo), "id");
          setFilteredParts(refs);
          id && dispatch(documentRevisionsActions.reload(id));
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @helpers
    isDateOverdue = (date?: string) => {
      if (!date) {
        return;
      }
      return Date.parse(date) < Date.now();
    };

    const setFilteredParts = (data) => {
      const partsSelected = data.reduce((selected, ref) => {
        if (ref?.metadata?.fieldId === name
            && ref.active
            && (ref?.type === SmartReferenceType.EquipmentReplacement || ref?.type === SmartReferenceType.LotUsage)) {
          selected.push({
            ...ref?.metadata,
            refId: ref?.id,
            overrideDocId: ref?.toDocRev?.document.docId,
            pmDueDate: ref.toDocRev?.precalc?.pm_due_date,
            calDueDate: ref.toDocRev?.precalc?.cali_due_date,
          });
        }
        return selected;
      }, [] as Partial<FBMPIProcedureSelectValue>[]);
      mpiProcedureState?.setPartsSelected(partsSelected);
    };

    function onClose() {
      formState?.unlockField(`${name}.${type}`);
      dialogState?.closeDialog();
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
      const quantity = item.quantity ? (item.quantity * lhrsQuantity) : "form.builder.none";
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
      isDateOverdue,
      mpiProcedureState,
      isPreview,
      dialogState,
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
