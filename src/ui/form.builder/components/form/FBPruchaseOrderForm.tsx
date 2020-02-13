import { Box, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
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
        partNumber: undefined,
        date: undefined,
        description: undefined,
        unitPrice: undefined,
        tax: undefined,
        order: undefined,
        isTraceabilityRequired: undefined,
      });
      setErrorMessage("");
    };
  }, []);
  const handleSubmit = (values) => {
    values.date = values.date || new Date();
    values.tax = values.tax || false;
    values.isTraceabilityRequired = values.isTraceabilityRequired || false;
    const fields = [
      "order",
      "units",
      "partNumber",
      "date",
      "description",
      "unitPrice",
    ];

    let missingFields = "";
    fields.forEach((field) => {
      if (!values[field]) {
        const fieldName = field.split(/(?=[A-Z])/).join(" ").toUpperCase();
        missingFields += `${fieldName} is required; `;
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
          inputProps={{ type: "number" }}
          label="form.builder.field.order"
          name="order"
        />
        <FBTextField
          label="form.builder.field.units"
          name="units"
        />
        <FBTextField
          label="form.builder.field.pn"
          name="partNumber"
        />
        <FBDatePicker
          label="form.builder.field.date"
          name="date"
        />
        <FBTextField
          label="form.builder.field.pn.description"
          name="description"
          rows="3"
        />
        <FBTextField
          inputProps={{ type: "number" }}
          label="form.builder.field.unit.price"
          name="unitPrice"
        />
        <FBCheckbox
          label="form.builder.field.tax"
          name="tax"
        />
        <FBCheckbox
          label="form.builder.field.is.traceability.required"
          name="isTraceabilityRequired"
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
