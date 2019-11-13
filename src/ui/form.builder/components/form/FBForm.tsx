import { Form, Formik } from "formik";
import React from "react";
import { FBFormikProps } from "../../types/formik";

const FBForm: React.FunctionComponent<FBFormikProps> = ({
  // tslint:disable-next-line: no-empty
  onSubmit = () => {},
  initialValues = {},
  ...props
}) => {

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      {...props}
    >
      <Form>
        {props.children}
      </Form>
    </Formik>
  );
};

export default FBForm;
