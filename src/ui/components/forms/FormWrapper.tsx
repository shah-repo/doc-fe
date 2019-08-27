import { Form, FormikErrors } from "formik";
import React, { useEffect } from "react";

interface Props {
  dirty: boolean;
  resetForm: () => void;
  initialValues: any;
}

const FormWrapper: React.FunctionComponent<Props> = ({
  dirty, resetForm, initialValues, children,
}) => {
  useEffect(() => {
    if (dirty) {
      resetForm();
    }
  }, [initialValues]);

  return (
    <Form>
      {children}
    </Form>
  );
};

export default FormWrapper;
