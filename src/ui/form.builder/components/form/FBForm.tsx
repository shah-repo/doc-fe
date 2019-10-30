import { Formik } from "formik";
import React from "react";
import { withFormikDefaults } from "../../hocs/withFormikDefaults";
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
    />
  );
};

export default withFormikDefaults(FBForm);
