import React from "react";
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
  const dialog = useDialog();

  const onSubmit = (values: any) => {
    const purchaseOrders = props.field.value || [];
    props.form.setFieldValue(props.name, [...purchaseOrders, values]);
  };

  const editItem = (index: number) => {
    console.log("edit item", index);
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
      />
      <FBPurchaseOrderTotal values={props.field.value} />
    </>
  );
};

export default withFormik(FBPurchaseOrderField);
