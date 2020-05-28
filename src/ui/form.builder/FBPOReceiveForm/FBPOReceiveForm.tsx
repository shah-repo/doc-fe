import React from "react";
import { FBForm, FBPOReceiveFormProps, FBTextField } from "..";
import { FormContext } from "../../components/forms/FormContext";


const FBPOReceiveForm: React.FunctionComponent<FBPOReceiveFormProps> = ({
  children,
}) => (
  <FBForm>
    <FormContext.Provider value={{ submitOnChange: false }}>
      <FBTextField
        inputProps={{ type: "number", min: "0" }}
        label="form.builder.quantity.received"
        name="received"
        rules="required|min:1"
      />
      <FBTextField
        rows="5"
        label="form.builder.comments.optional"
        name="comments"
      />
      {children}
    </FormContext.Provider>
  </FBForm>
);

export default FBPOReceiveForm;
