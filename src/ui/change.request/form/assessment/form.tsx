import { Box } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../../components/common/attachment.field/field";
import FilledSelectField from "../../../components/forms/fields/FilledSelect";
import { assessmentStatementOption } from "../../utils/helpers";
import { AssessmentItemProps } from "../../utils/types";

export type Props = AssessmentItemProps;

export const Form: React.FunctionComponent<Props> = ({
  type,
}) => {

  return (
    <Box component="div" style={{minWidth: "500px"}}>
      <FilledSelectField
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
