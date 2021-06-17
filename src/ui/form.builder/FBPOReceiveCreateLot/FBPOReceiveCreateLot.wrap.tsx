import React from "react";
import { FB, FBPOReceiveCreateLotProps } from "..";

export const withFBPOReceiveCreateLot = <T extends FBPOReceiveCreateLotProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleCancel,
    handleCreateLot,
    item,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();

    handleCreateLot = () => {
      dialogState?.closeDialog();
    };

    return Component({
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleCreateLot,
    });
  };

  return (props: T) => Comp(props);
};
