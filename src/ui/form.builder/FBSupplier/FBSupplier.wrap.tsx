import React from "react";
import { FB, FBDialogState, FBSupplierForm, FBSupplierProps, FBSupplierState } from "..";

export const withFBSupplier = <T extends FBSupplierProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAdd,
    ...props
  }: T) => {

    // MARK: @config
    const dialogState = FB.useRef(FBDialogState);
    const supplierState = FB.useRef(FBSupplierState);

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods
    handleAdd = () => dialogState?.config({
      open: true,
      title: "form.builder.create.new.supplier",
      content: <FBSupplierForm {...{ supplierState }}/>,
    });

    // MARK: @observer

    return Component({
      ...(props as T),
      handleAdd,
      dialogState,
      supplierState,
    });
  };

  Comp.displayName = "withFBSupplier";
  return Comp;
};
