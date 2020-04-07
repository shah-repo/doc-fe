import React from "react";
import FBPurchaseOrderLotForm from "./FBPurchaseOrderLotForm";

const FBPurchaseOrderLotFormContainer: React.FunctionComponent<any> = ({
  onSubmit,
  name,
  ...props
}) => {
  const handleSubmit = (values) => {
    const item = values[`${name}-formValues`];
    onSubmit(item);
  };
  const validateForm = (values) => {
    const item = values[`${name}-formValues`] || {};
    const required = "form.builder.required";
    const errors: any = {};

    !item.received && (errors.received = required);

    return errors;
  };
  return (
    <FBPurchaseOrderLotForm {...props} onSubmit={handleSubmit} validateForm={validateForm} name={name} />
  );
};

export default FBPurchaseOrderLotFormContainer;
