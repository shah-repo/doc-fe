import { Box } from "@material-ui/core";
import { Field, FieldProps } from "formik";
import React from "react";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import FilledSelectField from "../../components/forms/fields/FilledSelect";
import { assessmentStatementOption } from "../utils/helpers";
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
      <FilledSelectField
        name={`assessments.${type}.reasoning`}
        label="common.reasoning"
        options={assessmentStatementOption()}
        includeEmpty={true}
      />
      <Field name={`assessments.${type}.attachment`} render={attachmentRenderer} />
    </Box>
  );
};

export default Form;
