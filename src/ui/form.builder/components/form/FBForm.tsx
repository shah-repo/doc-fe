import { Formik, FormikConfig } from "formik";
import React from "react";
import { withFormDefaults } from "./utils/hoc";
import { FBFormProps } from "./utils/types";

const FBForm: React.FunctionComponent<FBFormProps> = ({
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
    />
  );
};

export default withFormDefaults(FBForm);
