import { Box } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
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
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <Form>
        <FBTextField
          type="number"
          label="Order"
          name="order"
        />
        <FBTextField
          label="Units"
          name="units"
        />
        <FBDatePicker
          label="PN/Date Required"
          name="date"
        />
        <FBTextField
          label="Description/PN"
          name="description"
          rows="3"
        />
        <FBTextField
          type="number"
          label="Price"
          name="price"
        />
        <FBCheckbox
          label="Tax"
          name="tax"
        />
        <FBCheckbox
          label="Is Traceability Required"
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
