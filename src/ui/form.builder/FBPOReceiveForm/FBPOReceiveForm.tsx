import { Grid } from "@material-ui/core";
import React from "react";
import { FBForm, FBPOReceiveFormProps, FBTextField } from "..";
import { FormContext } from "../../components/forms/FormContext";


const FBPOReceiveForm: React.FunctionComponent<FBPOReceiveFormProps> = ({
  children,
  item
}) => (
  <FBForm>
    <FormContext.Provider value={{ submitOnChange: false }}>
      <FBTextField
        label="form.builder.field.part.number.or.service"
        defaultValue={item?.partNumberDocId}
        disabled={true}
        hidden={!item?.partNumberDocId}
      />
      <FBTextField
        label="form.builder.description"
        defaultValue={item?.partNumberTitle || item?.description}
        disabled={true}
      />
      <FBTextField
        label="form.builder.field.ordered"
        defaultValue={item?.order}
        disabled={true}
      />
      <Grid 
        container={true}
        spacing={3}
        justify="space-between"
      >
        <Grid item={true} xs={6}>
          <FBTextField
            inputProps={{ type: "number", min: "0" }}
            label="form.builder.quantity.received"
            name="received"
            rules="required|min:1"
          />
        </Grid>
        <Grid item={true} xs={6}>
          <FBTextField
            label="form.builder.field.units"
            defaultValue={item?.units}
            disabled={true}
          />
        </Grid>
      </Grid>
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
