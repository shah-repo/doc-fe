import React from "react";
import { FB } from "../..";

export const withFBPurchaseOrderDialog = <T extends any>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    name = "",
    ...props
  }: T) => {
    const { poState } = FB.useStores();
    const addItem = () => {
      !props.disabled && poState.openDialog();
    };
    const closeDialog = () => {
      poState.setFormValues({});
      poState.closeDialog();
    };
    const isDialogOpen = poState.isDialogOpen;

    return Component({
      ...(props as T),
      poState,
      name,
      addItem,
      closeDialog,
      isDialogOpen,
    });
  };

  return (props: T) => Comp(props);
};
