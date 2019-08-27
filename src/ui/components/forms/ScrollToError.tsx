import { Form, FormikErrors } from "formik";
import React, { useEffect } from "react";

interface Props {
  errors: FormikErrors<any>;
  isSubmitting: boolean;
  isValidating: boolean;
}

const ScrollToError: React.FunctionComponent<Props> = ({
  errors, isSubmitting, isValidating,
}) => {
  useEffect(() => {
    const keys = Object.keys(errors);
    if (keys.length > 0 && isSubmitting && !isValidating) {
      const selector = `[id="field-${keys[0]}"]`;
      const errorElement = document.querySelector(selector) as HTMLElement;
  
      errorElement && errorElement.scrollIntoView();
    }
  }, [errors, isSubmitting, isValidating])

  return null;
};

export default ScrollToError;
