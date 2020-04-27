
import React from "react";
import { FB, FBPOReceiveFormProps } from "..";

export const withFBPOReceiveForm = <T extends FBPOReceiveFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleCancel,
    handleAdd,
    ...props
  }: T) => {

    const { dialogState, formState } = FB.useStores();

    handleAdd = () => {
      console.log(formState?.getValues());
      dialogState?.closeDialog();
    };

    return Component({
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleAdd,
    });
  };

  return (props: T) => Comp(props);
};
