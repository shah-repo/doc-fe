import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBAutocompleteAsyncOption, FBDialogState, FBSupplierForm, FBSupplierProps, FBSupplierState } from "..";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBSupplier = <T extends FBSupplierProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAdd,
    name = "",
    loading,
    disabled,
    isPreview,
    isInputOwner,
    ...props
  }: T) => {

    // MARK: @config
    const dialogState = FB.useRef(FBDialogState);
    const supplierState = FB.useRef(FBSupplierState);
    const { formState, workspaceState } = FB.useStores();

    isPreview = workspaceState?.mode === "preview";
    isInputOwner = FB.getIsInputOwner(name, workspaceState);
    disabled = !isInputOwner || disabled;

    // MARK: @reactions
    // on add supplier
    React.useEffect(() => reaction(
      () => supplierState.newSupplierApi.data,
      (data) => {
        const { id: supplierId } = data || {};
        FBAutocompleteAsyncStore.add(FBAutocompleteAsyncOption.suppliers, supplierId, data);
        formState?.setFieldValue(name, supplierId);
        formState?.getInputState(name)?.setRender();
        formState?.validate();
        formState?.setFieldAutosave(name);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers

    // MARK: @methods
    handleAdd = () => dialogState?.config({
      open: true,
      title: "form.builder.create.new.supplier",
      content: <FBSupplierForm />,
    });

    // MARK: @observer
    useObserver(() => {
      loading = (
        supplierState?.newSupplierApi.loading ||
        supplierState?.proposedDocIdApi.loading ||
        supplierState?.documentTypeApi.loading
      );
      disabled = disabled || loading;
    });

    return Component({
      ...(props as T),
      handleAdd,
      dialogState,
      supplierState,
      loading,
      disabled,
      name,
      isPreview,
    });
  };

  Comp.displayName = "withFBSupplier";
  return Comp;
};
