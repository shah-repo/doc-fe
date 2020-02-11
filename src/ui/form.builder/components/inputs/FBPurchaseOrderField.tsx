import { isUndefined } from "lodash";
import React, { useEffect, useState } from "react";
import useDialog from "../../../hooks/useDialog";
import FBStore from "../../stores/ui/FBStore";
import FBPurchaseOrderDialog from "../custom/FBPurchaseOrderDialog";
import FBPurchaseOrderTable from "../custom/FBPurchaseOrderTable";
import FBPurchaseOrderTotal from "../custom/FBPurchaseOrderTotal";
import FBSectionBox from "../layout/FBSectionBox";

const FBPurchaseOrderField: React.FunctionComponent<any> = ({
  options = [],
  label,
  disabled,
  ...props
}) => {
  const storeValue = FBStore.getValues()[props.name];
  const [initialValues, setInitialValues] = useState({});
  const [rowIndex, setRowIndex] = useState();
  const dialog = useDialog();

  useEffect(() => {
    if (!dialog.isOpen) {
      setRowIndex(undefined);
      setInitialValues({});
    }
  }, [dialog.isOpen]);

  const onSubmit = (values: any) => {
    const purchaseOrders = storeValue || [];
    if (isUndefined(rowIndex)) {
      FBStore.setValues({
        ...FBStore.getValues(),
        [props.name]: [...purchaseOrders, values],
      });
      return;
    }

    purchaseOrders[rowIndex] = values;
    FBStore.setValues({
      ...FBStore.getValues(),
      [props.name]: [...purchaseOrders],
    });
    setRowIndex(undefined);
    setInitialValues({});
  };

  const editItem = (index: number) => {
    setInitialValues(storeValue[index]);
    setRowIndex(index);
    dialog.open();
  };

  const deleteItem = (index: number) => {
    const filtered = storeValue.filter((order, i) => i !== index);
    FBStore.setValues({
      ...FBStore.getValues(),
      [props.name]: [...filtered],
    });
  };

  return (
    <>
      <FBSectionBox label={label} />
      <FBPurchaseOrderTable
        values={storeValue}
        editItem={editItem}
        deleteItem={deleteItem}
      />
      <FBPurchaseOrderDialog
        dialog={dialog}
        disabled={disabled}
        onSubmit={onSubmit}
        initialValues={initialValues}
      />
      <FBPurchaseOrderTotal values={storeValue} />
    </>
  );
};

export default FBPurchaseOrderField;
