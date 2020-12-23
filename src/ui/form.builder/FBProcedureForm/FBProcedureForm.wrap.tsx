import { isEmpty, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBAutocompleteAsyncOption, FBFormState, FBProcedureFormActions, FBProcedureFormProps, FBProcedureFormState, FBProcedureItemConfig, FBProcedureItemType } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { SelectOption } from "../../components/forms/fields/Select";

export const withFBProcedureForm = <T extends FBProcedureFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    formState,
    disabledOptions,
    procedureFormState,
    initialValues,
    optionId,
    type,
    lotOptions,
    partOptions,
    disabled,
    ...props
  }: T) => {
    // MARK: @config
    const { procedureState, dialogState } = FB.useStores();
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
    useEffect(() => reaction(
      () => formState?.inputState.get("title")?.value,
      (value) => {
        handleChangeOfPart();
        if (!value && !formState?.inputState.get("partLot")?.value) {
          procedureFormState?.fetchLots();
          procedureFormState?.fetchParts();
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);
    // if title and partLot empty it will set to default options
    useEffect(() => reaction(
      () => formState?.inputState.get("partLot")?.value,
      (value) => {
        handleChangeOfLot();
        if (!value && !formState?.inputState.get("title")?.value) {
          procedureFormState?.fetchLots();
          procedureFormState?.fetchParts();
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers
    function handleAdd() {
      const formValue = formState?.getValues() as FBProcedureItemConfig;
      procedureState?.addItem(formValue, type);
      handleCancel?.();
    }

    function handleCancel() {
      dialogState?.closeDialog();
    }

    function handleChangeOfPart() {
      const formValue = formState?.getValues() as FBProcedureItemConfig;
      // freeSolo or empty
      if (!formValue.title ||
        isEmpty(procedureFormState?.defaultParts.filter((e) => e.id === formValue?.title))) {
        return;
      }
      procedureFormState?.fetchLotsToPart(formValue.title);
    }

    function handleChangeOfLot() {
      const formValue = formState?.getValues() as FBProcedureItemConfig;
      if (!formValue.partLot) {
        return;
      }
      procedureFormState?.fetchPartsOfLot(formValue.partLot);
    }

    // MARK: @observer
    useObserver(() => {
      lotOptions = procedureFormState?.lotsToPart?.map((schemaItem: DocumentRevision) => ({
        value: schemaItem.id,
        text: `${schemaItem.document.docId} - rev ${schemaItem.revision} - ${schemaItem.name}`,
      } as SelectOption));
      partOptions = procedureFormState?.partsOfLot?.map((schemaItem: DocumentRevision) => ({
        value: schemaItem.id,
        text: `${schemaItem.document.docId} - rev ${schemaItem.revision} - ${schemaItem.name}`,
      } as SelectOption));
      disabled = !procedureFormState?.partsOfLot || !procedureFormState.lotsToPart;
    });

    return Component({
      ...(props as T),
      formState,
      disabledOptions,
      initialValues,
      optionId,
      type,
      lotOptions,
      partOptions,
      disabled,
    });
  };

  Comp.displayName = "withFBProcedureForm";
  return Comp;
};
