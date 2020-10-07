import { get } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBFormState, FBProcedureForm, FBProcedureFormActions, FBProcedureItemActionLocale, FBProcedureItemConfig, FBProcedureItemProps } from "..";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBProcedureItem = <T extends FBProcedureItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    onEditClick,
    handleAdd,
    handleEdit,
    handleCancel,
    handleRemove,
    getItem,
    loading,
    dialogState,
    formState,
    name,
    type,
    value,
    ...props
  }: T) => {

    // MARK: @config
    const { procedureState } = FB.useStores();
    dialogState = FB.useRef(FBDialogState);
    formState = FB.useRef<FBFormState>(FBFormState, {});

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods
    onClick = () => {
      formState?.reset();
      dialogState?.config({
        open: true,
        title: FBProcedureItemActionLocale[type],
        content: <FBProcedureForm {...{ formState, type }} />,
        actions: <FBProcedureFormActions {...{ handleAdd, handleCancel }} />,
      });
    };

    handleAdd = () => {
      const formValue = formState?.getValues() as FBProcedureItemConfig;
      procedureState?.addItem(formValue, type);
      formState?.reset();
      handleCancel?.();
    };

    handleEdit = (id: string) => {
      const formValue = formState?.getValues() as FBProcedureItemConfig;
      procedureState?.editItem(formValue, type, id);
      formState?.reset();
      handleCancel?.();
    };

    onEditClick = (id: string) => {
      const itemToEdit = procedureState?.[type]?.find((item) => item.id === id);
      if (!itemToEdit) { return; }
      const { title, unit, quantity } = itemToEdit;
      formState?.setValues({ ...{ title, unit, quantity } });
      dialogState?.config({
        open: true,
        title: FBProcedureItemActionLocale[`${type}Edit`],
        content: <FBProcedureForm {...{ formState, type }} />,
        actions: <FBProcedureFormActions
          {...{ handleCancel }}
          submitLabel="form.builder.save"
          handleAdd={() => handleEdit?.(id)}
        />,
      });
    };

    handleCancel = () => dialogState?.closeDialog();
    handleRemove = (id: string) => procedureState?.removeItem(id, type);
    getItem = (id: string): string => procedureState?.getItem(id, type) || "";

    // MARK: @observer
    useObserver(() => {
      // Hack! We should render parts only when data is available
      // We cannot rely on the state api loading value because of the double initialization issue.
      // This should be removed after refactoring and double initialization issue fixed
      loading = type === "materials"
        ? !FBAutocompleteAsyncStore.data.get(procedureState?.materialsId || "")
        : !FBAutocompleteAsyncStore.data.get(procedureState?.equipmentId || "");
      value = get(procedureState, type);
    });

    return Component({
      ...(props as T),
      onEditClick,
      onClick,
      handleRemove,
      getItem,
      dialogState,
      formState,
      loading,
      name,
      type,
      value,
    });
  };

  Comp.displayName = "withFBProcedureItem";
  return Comp;
};
