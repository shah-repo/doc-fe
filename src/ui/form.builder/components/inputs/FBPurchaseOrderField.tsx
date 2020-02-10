import { isUndefined } from "lodash";
import React, { useEffect, useState } from "react";
import { withFormik } from "../../../components/hoc/formik";
import useDialog from "../../../hooks/useDialog";
import FBPurchaseOrderDialog from "../custom/FBPurchaseOrderDialog";
import FBPurchaseOrderTable from "../custom/FBPurchaseOrderTable";
import FBPurchaseOrderTotal from "../custom/FBPurchaseOrderTotal";

const FBPurchaseOrderField: React.FunctionComponent<any> = ({
  options = [],
  label,
  disabled,
  ...props
}) => {
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
    const purchaseOrders = props.field.value || [];
    if (isUndefined(rowIndex)) {
      props.form.setFieldValue(props.name, [...purchaseOrders, values]);
      return;
    }

    purchaseOrders[rowIndex] = values;
    props.form.setFieldValue(props.name, [...purchaseOrders]);
    setRowIndex(undefined);
    setInitialValues({});
  };

  const editItem = (index: number) => {
    setInitialValues(props.field.value[index]);
    setRowIndex(index);
    dialog.open();
  };

  const deleteItem = (index: number) => {
    const filtered = props.field.value.filter((order, i) => i !== index);
    props.form.setFieldValue(props.name, filtered);
  };

  return (
    <>
      <div>{label}</div>
      {
        props.field.value &&
        <FBPurchaseOrderTable
          values={props.field.value}
          editItem={editItem}
          deleteItem={deleteItem}
        />
      }
      <FBPurchaseOrderDialog
        dialog={dialog}
        disabled={disabled}
        onSubmit={onSubmit}
        initialValues={initialValues}
      />
      <FBPurchaseOrderTotal values={props.field.value} />
    </>
  );
};

export default withFormik(FBPurchaseOrderField);
