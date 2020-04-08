import { Box, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { Dictionary } from "lodash";
import React from "react";
import Text from "../../../components/Text";
import FBButton from "../../components/inputs/FBButton";
import FBTextField from "../../components/inputs/FBTextField";
import { FBPurchaseOrderFormProps, PurchaseOrderItem } from "../FBPurchaseOrder.types";

interface ErrorProps { error?: string }
const Error: React.FunctionComponent<ErrorProps> = ({
  error,
}) => {
  if (!error) {
    return null;
  }

  return (
    <Box marginTop="-30px" marginBottom="10px">
      <Typography color="error" variant="subtitle2" >
        <Text message={error} />
      </Typography>
    </Box>
  );
};

const FBPurchaseOrderLotForm: React.FunctionComponent<FBPurchaseOrderFormProps> = ({
  initialValues = {} as Dictionary<PurchaseOrderItem>,
  onSubmit,
  closeDialog,
  name,
  validateForm,
}) => {
  const renderForm = (props) => {
    const { errors } = props;
    return (
      <Form>
        <FBTextField
          inputProps={{ type: "number" }}
          label="form.builder.field.order.received"
          name={`${name}-formValues.received`}
        />
        <Error error={errors.received} />
        <Box textAlign="center">
          <FBButton
            onClick={closeDialog}
            variant="outlined"
            label="common.close"
          />
          <FBButton
            variant="contained"
            buttonType="submit"
            label="form.builder.po.items.received"
          />
        </Box>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateForm}
      validateOnChange
    >
      {renderForm}
    </Formik>
  );
};

export default FBPurchaseOrderLotForm;
