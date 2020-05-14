import React from "react";
import { FBForm, FBPOReceiveFormProps, FBTextField } from "..";


const FBPOReceiveForm: React.FunctionComponent<FBPOReceiveFormProps> = ({
  children,
}) => (
  <FBForm>
    <FBTextField
      inputProps={{ type: "number", min: "0" }}
      label="form.builder.quantity.received"
      name="received"
      rules="required"
    />
    <FBTextField
      rows="5"
      label="form.builder.comments.optional"
      name="comments"
    />
    {children}
  </FBForm>
);

export default FBPOReceiveForm;
