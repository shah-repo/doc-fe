import { Box } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../../components/common/attachment.field/field";
import EditableSelectField from "../../../components/forms/fields/EditableSelect/field";
import { assessmentStatementOption } from "../../utils/helpers";
import { AssessmentItemProps } from "../../utils/types";

export type Props = AssessmentItemProps;

export const Form: React.FunctionComponent<Props> = ({
  type,
  form,
}) => {
  const { reasoning } = form.values.assessments[type];

  const onChange = (name: string, value: string | number) => {
    form.setFieldValue(name, value as string);
  };

  return (
    <Box component="div" style={{minWidth: "500px"}}>
      <EditableSelectField
        name={`assessments.${type}.reasoning`}
        label="common.reasoning"
        options={assessmentStatementOption()}
        includeEmpty={true}
      />
      <AttachmentField name={`assessments.${type}.attachment`} component="field" multiple={false} />;
    </Box>
  );
};

export default Form;
