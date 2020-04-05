import React from "react";
import { FB } from "../..";
import useDialog from "../../../hooks/useDialog";

export const withFBPurchaseOrderAddItem = <T extends any>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    name = "",
    ...props
  }: T) => {
    const { poState } = FB.useStores();
    const dialog = useDialog();
    const openDialog = () => {
      if (props.disabled) {
        return;
      }

      poState.setFormValues({});
      dialog.open();
    };
    const closeDialog = () => {
      poState.setFormValues({});
      dialog.close();
    };
    const onSubmit = (item) => {
      console.log(item);
    };

    return Component({
      ...(props as T),
      poState,
      name,
      openDialog,
      closeDialog,
      isDialogOpen: dialog.isOpen,
      onSubmit,
    });
  };

  return (props: T) => Comp(props);
};
