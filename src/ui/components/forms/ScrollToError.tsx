import { FormikErrors } from "formik";
import React, { useEffect } from "react";
import _ from "lodash";

interface Props {
  errors: FormikErrors<any>;
  isSubmitting: boolean;
  isValidating: boolean;
  status?: any;
}

const ScrollToError: React.FunctionComponent<Props> = ({
  errors, isSubmitting, isValidating, status
}) => {
  useEffect(() => {
    const isStatusObject = _.isObjectLike(status);
    let keys = Object.keys(errors);

    if (keys.length === 0 && isStatusObject) {
      keys = Object.keys(status);
    }

    if (keys.length > 0 && (isSubmitting && !isValidating || isStatusObject)) {
      const selector = `[id="field-${keys[0]}"]`;
      const errorElement = document.querySelector(selector) as HTMLElement;
  
      errorElement && errorElement.scrollIntoView();
    }
  }, [errors, isSubmitting, isValidating, status])

  return null;
};

export default ScrollToError;
