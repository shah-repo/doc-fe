import { Box } from "@material-ui/core";
import { Form, Formik } from "formik";
import { Dictionary } from "lodash";
import React from "react";
import InputField from "../../../components/forms/fields/Input";
import { required, validator } from "../../../components/forms/fields/validators";
import FBButton from "../../components/inputs/FBButton";
import FBTextField from "../../components/inputs/FBTextField";
import { FBPurchaseOrderFormProps, PurchaseOrderItem } from "../FBPurchaseOrder.types";
import { default as Error } from "../form/FBPurchaseOrderError";

const FBPurchaseOrderReceiveForm: React.FunctionComponent<FBPurchaseOrderFormProps> = ({
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
        <InputField
          name="password"
          label="transition.action.password"
          inputProps={{ type: "password" }}
          validate={validator(required)}
        />
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

export default FBPurchaseOrderReceiveForm;
