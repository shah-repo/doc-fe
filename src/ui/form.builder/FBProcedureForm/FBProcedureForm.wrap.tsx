import { filter, find, first, isEmpty, keyBy, lowerCase, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBAutocompleteAsyncOption, FBFormState, FBProcedureFormActions, FBProcedureFormFilterType, FBProcedureFormProps, FBProcedureFormState, FBProcedureItemConfig, FBProcedureItemType } from "..";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { checkIsDocumentMPI, checkIsDocumentMPIOutput } from "../../documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBProcedureForm = <T extends FBProcedureFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    lotFilterOptions,
    partFilterOptions,
    formState,
    disabledOptions,
    procedureFormState,
    initialValues,
    optionId,
    type,
    lotOptions,
    partOptions,
    partLoading,
    lotLoading,
    disabled,
    mode,
    lhrStepIndex,
    ...props
  }: T) => {
    // MARK: @config
    const { procedureState, mpiProcedureState, dialogState, lhrStepState, workspaceState } = FB.useStores();

    formState = FB.useRef<FBFormState>(FBFormState, { initialValues });
    procedureFormState = FB.useRef<FBProcedureFormState>(FBProcedureFormState, {
      initialValues,
    });
    const isDocumentMPI = checkIsDocumentMPI(workspaceState?.document?.document.documentType.groupOptions);
    const isDocumentMPIOutput = checkIsDocumentMPIOutput(workspaceState?.document?.document.documentType.groupOptions);

    const schemaItem = workspaceState?.getSchemaItemAt(lhrStepIndex);
    const config: Partial<Record<keyof typeof FBProcedureItemType, (() => void)>> = {
      materials: () => {
        optionId = FBAutocompleteAsyncOption.materials;
        disabledOptions = map(procedureState?.value?.materials, "title");
      },
      equipment: () => {
        optionId = FBAutocompleteAsyncOption.equipment;
        disabledOptions = map(procedureState?.value?.equipment, "title");
      },
    };
    config[type]?.();

    React.useEffect(() => {
      dialogState?.setActions(
        <FBProcedureFormActions {...{ handleAdd, handleCancel }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.materials),
      (data: DocumentRevision[]) => {
        if (mode === "mpi" && isDocumentMPIOutput) {
          const materials = Array.from(data.values());
          const matDocId = find(materials, (rev) => rev.id === formState?.inputState.get("title")?.value)?.documentId;
          const releasedRev = find(
            materials,
            (rev) => rev.documentId === matDocId && isDocumentRevisionReleased(rev.status)
          );
          if (!releasedRev) { return; }
          formState?.setFieldValue("title", releasedRev?.id);
          formState?.getInputState("title")?.setRender();
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @reactions
    // Fetch lots on part selection
    useEffect(() => reaction(
      () => formState?.inputState.get("title")?.value,
      (id) => {
        if (id && FB.isUUID(id)) {
          return procedureFormState?.fetchLotsToPart(id);
        }
        procedureFormState?.clearLots();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => procedureFormState?.lotsApi.data,
      (data) => procedureFormState?.setLots(map(data, "id")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // if title and partLot empty it will set to default options
    useEffect(() => reaction(
      () => formState?.inputState.get("partLot")?.value,
      (id) => {
        if (id && FB.isUUID(id)) {
          return procedureFormState?.fetchPartsOfLot(id);
        }
        procedureFormState?.clearParts();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => procedureFormState?.partsApi.data,
      (data) => {
        const partValue = formState?.getFieldValue("title");
        procedureFormState?.setParts(map(data, "id"));
        if (partValue) { return; }
        formState?.setFieldValue("title", first(data)?.id);
        formState?.getInputState("title")?.setRender();
        formState?.validate();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers
    function handleAdd() {
      const formValue = formState?.getValues() as FBProcedureItemConfig;
      if (mode === "lhr") {
        lhrStepState?.editItem(formValue, type);
        if (schemaItem) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          workspaceState!.schema![lhrStepIndex!] = {
            ...schemaItem,
            editorConfig: {
              ...schemaItem?.editorConfig,
              parameters: {
                ...keyBy(lhrStepState?.editedParameters, "paramsId"),
              },
            },
          };
        }
        return handleCancel?.();
      }
      procedureState?.addItem(formValue, type);
      mpiProcedureState?.addItem(formValue, type);
      handleCancel?.();
    }

    function handleCancel() {
      dialogState?.closeDialog();
    }

    function handleFilter(
      data: DocumentRevision[],
      type: FBProcedureFormFilterType,
      inputValue: string,
    ) {
      const typeValue = formState?.getFieldValue(type);
      data = type === FBProcedureFormFilterType.lots ?
        data.filter((e) => e.status === DocumentRevisionStatus.Released) : data;
      let filtered = typeValue ? [] : data;
      const relation = type === FBProcedureFormFilterType.parts
        ? procedureFormState?.lots
        : procedureFormState?.parts;

      if (!isEmpty(relation)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        filtered = filter(data, (option) => relation!.includes(option.id));
      }
      filtered = filter(filtered, (option) => {
        const { name, displayRevision, document: { docId = "" } = {} } = option;
        const optionLabel = `${name} - rev ${displayRevision} - ${docId}`;
        return lowerCase(optionLabel).includes(lowerCase(inputValue));
      });
      return filtered;
    }

    // MARK: @methods
    lotFilterOptions = (options, { inputValue }) =>
      handleFilter(options, FBProcedureFormFilterType.lots, inputValue);

    partFilterOptions = (options, { inputValue }) =>
      handleFilter(options, FBProcedureFormFilterType.parts, inputValue);

    // MARK: @observer
    useObserver(() => {
      partLoading = procedureFormState?.partsApi.loading;
      lotLoading = procedureFormState?.lotsApi.loading;
      disabled = formState?.inputState.get("LHRTparameter")?.value;
    });

    return Component({
      ...(props as T),
      lotFilterOptions,
      partFilterOptions,
      formState,
      disabledOptions,
      initialValues,
      optionId,
      type,
      lotOptions,
      partOptions,
      partLoading,
      lotLoading,
      disabled,
      mode,
      isDocumentMPI,
    });
  };

  Comp.displayName = "withFBProcedureForm";
  return Comp;
};
