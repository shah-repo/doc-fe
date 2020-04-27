import React from "react";
import FBReceivePOFormPresenter from "./FBReceivePOForm.presenter";

const FBReceivePOFormContainer: React.FunctionComponent<any> = ({
  onSubmit,
  name,
  ...props
}) => {
  const validateForm = (values) => {
    const item = values[`${name}-formValues`] || {};
    const required = "form.builder.required";
    const errors: any = {};

    !item.received && (errors.received = required);

    return errors;
  };
  return (
    <FBReceivePOFormPresenter
      {...props}
      onSubmit={onSubmit}
      validateForm={validateForm}
      name={name}
    />
  );
};

export default FBReceivePOFormContainer;
