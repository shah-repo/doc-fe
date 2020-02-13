import { isUndefined } from "lodash";
import React, { useEffect, useState } from "react";
import useDialog from "../../../hooks/useDialog";
import FBStore from "../../stores/ui/FBStore";
import FBPurchaseOrderDialog from "../custom/FBPurchaseOrderDialog";
import FBPurchaseOrderTable from "../custom/FBPurchaseOrderTable";
import FBPurchaseOrderTotal from "../custom/FBPurchaseOrderTotal";
import FBSectionBox from "../layout/FBSectionBox";

export interface PurchaseOrderItem {
  order: number;
  units: string;
  partNumber: string;
  date: Date;
  description: string;
  unitPrice: number;
  tax: boolean;
  isTraceabilityRequired: boolean;
}

export interface PurchaseOrder {
  items: PurchaseOrderItem[];
  shippingCost: number | undefined;
}

const FBPurchaseOrderField: React.FunctionComponent<any> = ({
  label,
  disabled,
  ...props
}) => {
  const storeValue = FBStore.getValues()[props.name] || { items: [], shippingCost: undefined };
  const [initialValues, setInitialValues] = useState<PurchaseOrderItem | undefined>();
  const [rowIndex, setRowIndex] = useState();
  const dialog = useDialog();

  useEffect(() => {
    if (!storeValue) {
      FBStore.setValues({
        ...FBStore.getValues(),
        [props.name]: { items: [], shippingCost: undefined },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dialog.isOpen) {
      setRowIndex(undefined);
      setInitialValues(undefined);
    }
  }, [dialog.isOpen]);

  const onSubmit = (values: any) => {
    const items = storeValue.items || [];
    if (isUndefined(rowIndex)) {
      FBStore.setValues({
        ...FBStore.getValues(),
        [props.name]: {
          ...storeValue,
          items: [...items, values],
        },
      });
      return;
    }

    items[rowIndex] = values;
    FBStore.setValues({
      ...FBStore.getValues(),
      [props.name]: {
        ...storeValue,
        items: [...items],
      },
    });
    setRowIndex(undefined);
    setInitialValues(undefined);
  };

  const editItem = (index: number) => {
    setInitialValues(storeValue.items[index]);
    setRowIndex(index);
    dialog.open();
  };

  const deleteItem = (index: number) => {
    const filtered = (storeValue.items || []).filter((order, i) => i !== index);
    FBStore.setValues({
      ...FBStore.getValues(),
      [props.name]: {
        ...storeValue,
        items: [...filtered],
      },
    });
  };

  return (
    <>
      <FBSectionBox label={label} />
      <FBPurchaseOrderTable
        values={storeValue.items}
        editItem={editItem}
        deleteItem={deleteItem}
      />
      <FBPurchaseOrderDialog
        dialog={dialog}
        disabled={disabled}
        onSubmit={onSubmit}
        initialValues={initialValues}
      />
      <FBPurchaseOrderTotal
        values={storeValue}
        name={props.name}
      />
    </>
  );
};

export default FBPurchaseOrderField;
