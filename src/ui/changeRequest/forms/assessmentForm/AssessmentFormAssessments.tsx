import { FieldArrayRenderProps, FieldProps, FieldArray } from "formik";
import { Typography } from "@material-ui/core";
import React from "react";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";
import InputField from "../../../components/forms/fields/Input";
import { ChangeRequestFormValues } from "../types";
import AttachmentsContainer from '../attachments/Attachments.container';

interface Props extends FieldProps<ChangeRequestFormValues> {}

const AssessmentFormAssessments: React.FunctionComponent<Props> = () => {
  const renderAttachments = (props: FieldArrayRenderProps) => <AttachmentsContainer attachmentsKey="assessment" {...props} />;

  return (
    <React.Fragment>
      <InputField
        name="assessment.description"
        label="changeRequest.assessmentForm.assessments"
        validate={validator(required)}
      />
      <FieldArray name="assessment.attachments" render={renderAttachments} />
    </React.Fragment>
  );
};

export default AssessmentFormAssessments;
