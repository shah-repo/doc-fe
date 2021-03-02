import { cloneDeep, get } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBFormMode, FBMPIProcedureItemProps, FBProcedureForm, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemType } from "..";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBMPIProcedureItem = <T extends FBMPIProcedureItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    handleRemove,
    getItem,
    getLot,
    loading,
    dialogState,
    name,
    type,
    value,
    ...props
  }: T) => {

    // MARK: @config
    const { mpiProcedureState } = FB.useStores();
    dialogState = FB.useRef(FBDialogState);

    // MARK: @reactions

    // MARK: @helpers

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
        content: <FBProcedureForm {...{ type }} initialValues={cloneDeep(part)} />,
      });
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
      getItem,
      getLot,
      dialogState,
      loading,
      name,
      type,
      value,
    });
  };

  Comp.displayName = "withFBMPIProcedureItem";
  return Comp;
};
