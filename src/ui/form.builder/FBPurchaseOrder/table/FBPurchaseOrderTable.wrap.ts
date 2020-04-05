import React, { useState } from "react";
import { FB } from "../..";
import useDialog from "../../../hooks/useDialog";

export const withFBPurchaseOrderTable = <T extends any>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    ...props
  }: T) => {
    const [index, setIndex] = useState(undefined);
    const [initialValues, setInitialValues] = useState<any>(undefined);
    const { poState } = FB.useStores();
    const dialog = useDialog();
    const handleEdit = (index, item) => () => {
      if (props.disabled) {
        return;
      }
      poState.setFormValues(item);
      setIndex(index);
      setInitialValues({ [`${props.name}-formValues`]: item });
      dialog.open();
    };
    const handleDelete = (index) => (e) => {
      e.stopPropagation();
      !props.disabled && poState.deleteItem(index);
    };
    const closeDialog = () => {
      dialog.close();
      setIndex(undefined);
      setInitialValues(undefined);
    };
    const onSubmit = (item) => {
      dialog.close();
      poState.updateItem(index, item);
      setIndex(undefined);
      setInitialValues(undefined);
      poState.clearFormValues();
    };

    return Component({
      ...(props),
      poState,
      handleEdit,
      handleDelete,
      isDialogOpen: dialog.isOpen,
      closeDialog,
      initialValues,
      onSubmit,
    });
  };

  return (props: T) => Comp(props);
};
