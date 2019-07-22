import { Box } from "@material-ui/core";
import { Field, FieldProps } from "formik";
import React from "react";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import FilledInputField from "../../components/forms/fields/FilledInput";
import { AssessmentItemProps } from "../utils/types";
import Attachment from "./attachment";

export type Props = AssessmentItemProps;

export const Form: React.FunctionComponent<Props> = ({
  type,
}) => {

  const attachmentRenderer = (props: FieldProps<ChangeRequestFormValues>) => (
    <Attachment {...props} type={type} />
  );

  return (
    <Box component="div" style={{minWidth: "500px"}}>
      <FilledInputField
        name={`assessments.${type}.reasoning`}
        label="common.reasoning"
        inputProps={{ multiline: true, rows: "2" }}
      />
      <Field name={`assessments.${type}.attachment`} render={attachmentRenderer} />
    </Box>
  );
};

export default Form;
