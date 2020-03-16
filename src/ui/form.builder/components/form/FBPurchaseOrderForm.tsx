import { Box, Typography } from "@material-ui/core";
import { Form, Formik, FormikErrors } from "formik";
import React, { useEffect, useState } from "react";
import FBStore from "../../stores/ui/FBStore";
import FBButton from "../inputs/FBButton";
import FBCheckbox from "../inputs/FBCheckbox";
import FBDatePicker from "../inputs/FBDatePicker";
import { PurchaseOrderItem } from "../inputs/FBPurchaseOrderField";
import FBTextField from "../inputs/FBTextField";

interface Props {
  initialValues?: PurchaseOrderItem;
  onSubmit: (values: any) => void;
  closeDialog: () => void;
  items: PurchaseOrderItem[];
}

const FBPurchaseOrderForm: React.FunctionComponent<Props> = ({
  initialValues = {} as PurchaseOrderItem,
  onSubmit,
  closeDialog,
  items,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => () => {
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
  }, []);
  const handleSubmit = (values: PurchaseOrderItem) => {
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
  const validate = (values: PurchaseOrderItem) => {
    const errors: FormikErrors<any> = {};

    const isUniquePartNumber = !items.map((item) => item.partNumber).includes(values.partNumber);
    const isPartNumberInitialValue = initialValues.partNumber === values.partNumber;

    if (!isUniquePartNumber && !isPartNumberInitialValue) {
      // errors.partNumber = "form.builder.already.taken";
      errors.partNumber = "Part Number must be unique";
      setErrorMessage("Part Number must be unique");
    } else {
      errorMessage && setErrorMessage("");
    }

    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validate}
    >
      <Form>
        <Box marginBottom="10px">
          <Typography color="error">
            {errorMessage}
          </Typography>
        </Box>
        <FBTextField
          inputProps={{ type: "number" }}
          label="form.builder.field.qunatity.ordered"
          name="order"
        />
        <FBTextField
          label="form.builder.field.units"
          name="units"
        />
        <FBTextField
          label="form.builder.field.part.number"
          name="partNumber"
        />
        <FBDatePicker
          label="form.builder.field.date.required"
          name="date"
        />
        <FBTextField
          label="form.builder.field.supplier.part.number"
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
