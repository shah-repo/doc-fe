import { Formik, FormikConfig } from "formik";
import React from "react";
import { withFormDefaults } from "./utils/hoc";

const FBForm: React.FunctionComponent<FormikConfig<any>> = ({
  ...props
}) => {

  return (
    <Formik
      {...props}
    />
  );
};

export default withFormDefaults(FBForm);
