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
    handleAdd,
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
    onClick = () => dialogState?.config({
      open: true,
      title: FBProcedureItemActionLocale[type],
      content: <FBProcedureForm {...{ formState, type }} />,
      actions: <FBProcedureFormActions {...{ handleAdd, handleCancel }} />,
    });

    handleAdd = () => {
      const formValue = formState?.getValues() as FBProcedureItemConfig;
      procedureState?.addItem(formValue, type);
      formState?.reset();
      handleCancel?.();
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
