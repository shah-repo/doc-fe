import { Box } from "@material-ui/core";
import { isUndefined } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useDialog from "../../../hooks/useDialog";
import { TAX_RATE } from "../../helpers/constants";
import FBStore from "../../stores/ui/FBStore";
import FBApprovalMatrixTable from "../custom/FBApprovalMatrixTable";
import FBPurchaseOrderDialog from "../custom/FBPurchaseOrderDialog";
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
  capitalEquipment: boolean;
}

export interface PurchaseOrder {
  items: PurchaseOrderItem[];
  shippingCost: number | undefined;
}

const FBapprovalMatrixField: React.FunctionComponent<any> = ({
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

  const onSubmit = (values: PurchaseOrderItem) => {
    const items = storeValue.items || [];
    const total = Number(values.order) * Number(values.unitPrice);
    const tax = values.tax ? total * TAX_RATE : 0;
    const withPreCalcValues = {
      ...values,
      index: rowIndex + 1,
      formattedDate: moment(values.date).format("MM/DD/YYYY"),
      formattedTotal: (total + tax).toFixed(2),
      formattedUnitPrice: Number(values.unitPrice || 0).toFixed(2),
    };
    if (isUndefined(rowIndex)) {
      FBStore.setValues({
        ...FBStore.getValues(),
        [props.name]: {
          ...storeValue,
          items: [...items, withPreCalcValues],
        },
      });
      return;
    }

    items[rowIndex] = withPreCalcValues;
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
    // workaround need to calculate total cost when editing item
    FBStore.setValues({
      ...FBStore.getValues(),
      ...storeValue.items[index],
    });
    setRowIndex(index);
    dialog.open();
  };

  const deleteItem = (index: number) => {
    const filtered = (storeValue.items || [])
      .filter((order, i) => i !== index)
      .map((value, index) => ({ ...value, index: index + 1 }));

    FBStore.setValues({
      ...FBStore.getValues(),
      [props.name]: {
        ...storeValue,
        items: [...filtered],
      },
    });
  };

  return (
    <Box mt={3}>
      <FBSectionBox label={label} />
      <FBApprovalMatrixTable
        values={storeValue.items}
        editItem={editItem}
        deleteItem={deleteItem}
        disabled={disabled}
      />
      <FBPurchaseOrderDialog
        dialog={dialog}
        disabled={disabled}
        onSubmit={onSubmit}
        initialValues={initialValues}
        items={storeValue.items}
      />
      <FBPurchaseOrderTotal
        values={storeValue}
        name={props.name}
        disabled={disabled}
      />
    </Box>
  );
};

export default FBapprovalMatrixField;
