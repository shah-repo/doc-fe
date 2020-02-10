import { Form, Formik } from "formik";
import React from "react";
import FBButton from "../inputs/FBButton";
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
          label="Order"
          name="order"
        />
        <FBTextField
          label="Units"
          name="units"
        />
        <FBTextField
          label="PN/Date Required"
          name="date"
        />
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
      </Form>
    </Formik>
  );
};

export default FBPurchaseOrderForm;
