import { cloneDeep, get } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBFormMode, FBProcedureForm, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemProps, FBProcedureItemType } from "..";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBProcedureItem = <T extends FBProcedureItemProps>(
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
    disabled,
    locked,
    ...props
  }: T) => {

    // MARK: @config
    const { procedureState, workspaceState, formState } = FB.useStores();
    dialogState = FB.useRef(FBDialogState);
    const { id } = workspaceState || {};

    // MARK: @reactions

    // MARK: @helpers
    function handleLockField() {
      if (!id) { return; }
      if (!name) { return; }
      const namePart = `${name}.${type}`;
      formState?.lockFields({
        fields: [{
          formInput: [{
            [namePart]: true,
          }],
        }],
        documentRevisionId: id,
      }, namePart);
    }

    function onClose() {
      formState?.unlockField(`${name}.${type}`);
    }

    // MARK: @methods
    onClick = (part?: FBProcedureItemConfig) => {
      handleLockField();
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
        content: <FBProcedureForm {...{ type, name, onClose }} initialValues={cloneDeep(part)} />,
      });
    };

    handleRemove = (id: string) => procedureState?.removeItem(id, type);
    getItem = (id: string): string => procedureState?.getItem(id, type) || "";
    getLot = (id?: string): string => procedureState?.getLot(id) || "";

    // MARK: @observer
    useObserver(() => {
      // Hack! We should render parts only when data is available
      // We cannot rely on the state api loading value because of the double initialization issue.
      // This should be removed after refactoring and double initialization issue fixed
      if (type === FBProcedureItemType.attachments) { return; }
      if (type === FBProcedureItemType.materials) {
        loading = (
          !FBAutocompleteAsyncStore.data.get(procedureState?.materialsId || "") ||
          !FBAutocompleteAsyncStore.data.get(procedureState?.lotsId || "")
        );
      } else {
        loading = !FBAutocompleteAsyncStore.data.get(procedureState?.equipmentId || "");
      }
      value = get(procedureState, type);
      disabled = disabled || formState?.locked.get(`${name}.${type}`)?.locked;
      locked = formState?.locked.get(`${name}.${type}`)?.locked;
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
      disabled,
      locked,
    });
  };

  Comp.displayName = "withFBProcedureItem";
  return Comp;
};
