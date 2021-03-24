import { filter, first, isEmpty, lowerCase, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBAutocompleteAsyncOption, FBFormState, FBProcedureFormActions, FBProcedureFormFilterType, FBProcedureFormProps, FBProcedureFormState, FBProcedureItemConfig, FBProcedureItemType } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

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
    ...props
  }: T) => {
    // MARK: @config
    const { procedureState, mpiProcedureState, dialogState } = FB.useStores();
    formState = FB.useRef<FBFormState>(FBFormState, { initialValues });
    procedureFormState = FB.useRef<FBProcedureFormState>(FBProcedureFormState, {
      initialValues,
    });

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
    });
  };

  Comp.displayName = "withFBProcedureForm";
  return Comp;
};
