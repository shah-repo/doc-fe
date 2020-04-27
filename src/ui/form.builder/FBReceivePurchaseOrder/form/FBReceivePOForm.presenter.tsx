import { Box } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import FBTextField from "../../components/inputs/FBTextField";
import { default as Error } from "../../FBPurchaseOrder/form/FBPurchaseOrderError";
import FBReceivePOSubmit from "./FBReceivePOSubmit";

const FBReceivePOFormPresenter: React.FunctionComponent<any> = ({
  onSubmit,
  closeDialog,
  name,
  validateForm,
}) => {
  const renderForm = (props) => {
    const {
      errors,
      submitForm,
      values,
      isValid,
      validateForm: startValidation,
      dirty,
    } = props;

    return (
      <Form>
        <FBTextField
          inputProps={{ type: "number" }}
          label="form.builder.quantity.received"
          name={`${name}-formValues.received`}
        />
        <Error error={errors.received} />
        <FBTextField
          rows="5"
          label="form.builder.comments.optional"
          name={`${name}-formValues.comments`}
        />
        <Box textAlign="center">
          <FBReceivePOSubmit
            submitForm={submitForm}
            formValues={values}
            isValid={isValid}
            startValidation={startValidation}
            dirty={dirty}
            name={name}
            closeDialog={closeDialog}
          />
        </Box>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={onSubmit}
      validate={validateForm}
      validateOnChange
    >
      {renderForm}
    </Formik>
  );
};

export default FBReceivePOFormPresenter;
