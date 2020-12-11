import { cloneDeep, get } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBFormMode, FBProcedureForm, FBProcedureFormState, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemProps, FBProcedureItemType } from "..";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBProcedureItem = <T extends FBProcedureItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    handleRemove,
    getItem,
    loading,
    dialogState,
    name,
    type,
    value,
    ...props
  }: T) => {

    // MARK: @config
    const { procedureState } = FB.useStores();
    dialogState = FB.useRef(FBDialogState);
    const procedureFormState = FB.useRef(FBProcedureFormState);

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods
    onClick = (part?: FBProcedureItemConfig) => {
      procedureFormState.fetchPartsOfLot(part?.partLot);
      dialogState?.config({
        open: true,
        title: {
          locale: "form.builder.action.mode",
          values: {
            mode: part ? FBFormMode.edit : FBFormMode.add,
            title: `${FBProcedureItemLocale[type]}|s`,
          },
        },
        content: <FBProcedureForm {...{ type }} initialValues={cloneDeep(part)} />,
      });
    };

    handleRemove = (id: string) => procedureState?.removeItem(id, type);
    getItem = (id: string): string => procedureState?.getItem(id, type) || "";

    // MARK: @observer
    useObserver(() => {
      // Hack! We should render parts only when data is available
      // We cannot rely on the state api loading value because of the double initialization issue.
      // This should be removed after refactoring and double initialization issue fixed
      if (type === FBProcedureItemType.attachments) { return; }
      loading = type === FBProcedureItemType.materials
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
      loading,
      name,
      type,
      value,
    });
  };

  Comp.displayName = "withFBProcedureItem";
  return Comp;
};
