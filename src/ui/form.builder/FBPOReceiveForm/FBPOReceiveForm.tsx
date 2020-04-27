import React from "react";
import { FBForm, FBPOReceiveFormProps, FBTextField } from "..";
import { withFBPOReceiveForm } from "./FBPOReceiveForm.wrap";


const FBPOReceiveForm: React.FunctionComponent<FBPOReceiveFormProps> = ({
  name,
  children,
  ...props
}) => (
  <FBForm>
    <FBTextField
      inputProps={{ type: "number" }}
      label="form.builder.quantity.received"
      name={`${name}-formValues.received`}
      rules="required"
    />
    <FBTextField
      rows="5"
      label="form.builder.comments.optional"
      name={`${name}-formValues.comments`}
    />
    {children}
  </FBForm>
);

export default withFBPOReceiveForm(FBPOReceiveForm);
