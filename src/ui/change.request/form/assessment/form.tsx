import { Box } from "@material-ui/core";
import { Field, FieldProps } from "formik";
import React from "react";
import { ChangeRequestFormValues } from "../../../changeRequest/forms/types";
import EditableSelect from "../../../components/forms/fields/EditableSelect/EditableSelect";
import { assessmentStatementOption } from "../../utils/helpers";
import { AssessmentItemProps } from "../../utils/types";
import Attachment from "./attachment";

export type Props = AssessmentItemProps;

export const Form: React.FunctionComponent<Props> = ({
  type,
  form,
}) => {
  const { reasoning } = form.values.assessments[type];

  const attachmentRenderer = (props: FieldProps<ChangeRequestFormValues>) => (
    <Attachment {...props} type={type} />
  );

  const onChange = (name: string, value: string | number) => {
    form.setFieldValue(name, value as string);
  };

  return (
    <Box component="div" style={{minWidth: "500px"}}>
      <EditableSelect
        name={`assessments.${type}.reasoning`}
        label="common.reasoning"
        options={assessmentStatementOption()}
        includeEmpty={true}
        defaultValue={reasoning || ""}
        onChange={onChange}
      />
      <Field name={`assessments.${type}.attachment`} render={attachmentRenderer} />
    </Box>
  );
};

export default Form;
