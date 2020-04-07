import React, { useState } from "react";
import { FB } from "../..";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import useDialog from "../../../hooks/useDialog";
import FBStore from "../../stores/ui/FBStore";
import { FBPurchaseOrderTableProps } from "../FBPurchaseOrder.types";

export const withFBPurchaseOrderTable = <T extends FBPurchaseOrderTableProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    ...props
  }: T) => {
    const { document } = FBStore;
    const isDocumentReleased = document.status === DocumentRevisionStatus.Released;
    const [index, setIndex] = useState(undefined);
    const [initialValues, setInitialValues] = useState<any>(undefined);
    const { poState } = FB.useStores();
    const dialog = useDialog();
    const handleEdit = (index, item) => () => {
      if (props.disabled && !isDocumentReleased) {
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
      poState.clearFormValues();
    };
    const onSubmit = (item) => {
      poState.updateItem(index, item);
      closeDialog();
    };

    return Component({
      ...(props),
      handleEdit,
      handleDelete,
      isDialogOpen: dialog.isOpen,
      closeDialog,
      initialValues,
      onSubmit,
      items: poState.po.items,
      isDocumentReleased,
    });
  };

  return (props: T) => Comp(props);
};
