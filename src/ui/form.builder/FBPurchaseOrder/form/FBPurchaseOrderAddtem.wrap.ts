import React from "react";
import { FB } from "../..";
import useDialog from "../../../hooks/useDialog";

export const withFBPurchaseOrderAddItem = <T extends any>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
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
      dialog.close();
      poState.setFormValues(undefined);
    };
    const onSubmit = (item) => {
      console.log(item);
      poState.setFormValues(undefined);
    };

    return Component({
      ...(props),
      poState,
      openDialog,
      closeDialog,
      isDialogOpen: dialog.isOpen,
      onSubmit,
    });
  };

  return (props: T) => Comp(props);
};
