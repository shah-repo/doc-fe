import { Form, FormikErrors } from "formik";
import React, { useEffect } from "react";

interface Props {
  dirty: boolean;
  resetForm: () => void;
  initialValues: any;
  errors: FormikErrors<any>;
  isSubmitting: boolean;
  isValidating: boolean;
}

const FormWrapper: React.FunctionComponent<Props> = ({
  dirty, resetForm, initialValues, children, errors = {},
  isSubmitting, isValidating,
}) => {
  useEffect(() => {
    const keys = Object.keys(errors);
    if (keys.length > 0 && isSubmitting && !isValidating) {
      const selector = `[id="field-${keys[0]}"]`;
      const errorElement = document.querySelector(selector) as HTMLElement;
  
      errorElement && errorElement.scrollIntoView();
    }
  }, [errors, isSubmitting, isValidating])
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
