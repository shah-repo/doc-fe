import { Box } from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import { FBFormikProps } from "../../types/formik";

const FBForm: React.FunctionComponent<FBFormikProps> = ({
  // tslint:disable-next-line: no-empty
  onSubmit = () => {},
  initialValues = {},
  ...props
}) => {
  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues} {...props}>
      <Box>{props.children}</Box>
    </Formik>
  );
};

export default FBForm;
