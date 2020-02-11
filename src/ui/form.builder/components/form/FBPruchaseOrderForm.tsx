import { Box, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { isUndefined } from "util";
import FBStore from "../../stores/ui/FBStore";
import FBButton from "../inputs/FBButton";
import FBCheckbox from "../inputs/FBCheckbox";
import FBDatePicker from "../inputs/FBDatePicker";
import FBTextField from "../inputs/FBTextField";

interface Props {
  initialValues?: any;
  onSubmit: (values: any) => void;
  closeDialog: () => void;
}

const FBPurchaseOrderForm: React.FunctionComponent<Props> = ({
  initialValues = {},
  onSubmit,
  closeDialog,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    return () => {
      FBStore.setValues({
        ...FBStore.getValues(),
        units: undefined,
        date: undefined,
        description: undefined,
        price: undefined,
        tax: undefined,
        order: undefined,
      });
      setErrorMessage("");
    };
  }, []);
  const handleSubmit = (values) => {
    values.date = values.date || new Date();
    const fields = [
      "order",
      "units",
      "date",
      "description",
      "price",
    ];

    let missingFields = "";
    fields.forEach((field) => {
      if (isUndefined(values[field])) {
        missingFields += `${field} is required; `;
      }
    });

    if (missingFields) {
      setErrorMessage(missingFields);
      return;
    }

    onSubmit(values);
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <Box marginBottom="10px">
          <Typography color="error">
              {errorMessage}
          </Typography>
        </Box>
        <FBTextField
          type="number"
          label="form.builder.field.order"
          name="order"
        />
        <FBTextField
          label="form.builder.field.units"
          name="units"
        />
        <FBDatePicker
          label="form.builder.field.pn.date"
          name="date"
        />
        <FBTextField
          label="form.builder.field.pn.description"
          name="description"
          rows="3"
        />
        <FBTextField
          type="number"
          label="form.builder.field.price"
          name="price"
        />
        <FBCheckbox
          label="form.builder.field.tax"
          name="tax"
        />
        <FBCheckbox
          label="form.builder.field.is.traceability.required"
          name="traceability"
        />
        <Box textAlign="right">
          <FBButton
            type="button"
            variant="outlined"
            onClick={closeDialog}
            label="Cancel"
          />
          <FBButton
            type="submit"
            label="Done"
          />
        </Box>
      </Form>
    </Formik>
  );
};

export default FBPurchaseOrderForm;
