import { FieldArray, FieldArrayRenderProps, FieldProps } from "formik";
import React from "react";
import InputField from "../../../components/forms/fields/Input";
import {
  required,
  validator,
} from "../../../components/forms/fields/validators";
import AttachmentsContainer from "../attachments/Attachments.container";
import { ChangeRequestFormValues } from "../types";

interface Props extends FieldProps<ChangeRequestFormValues> {}

const AssessmentFormAssessments: React.FunctionComponent<Props> = () => {
  const renderAttachments = (props: FieldArrayRenderProps) => (
    <AttachmentsContainer attachmentsKey="assessment" {...props} />
  );

  return (
    <React.Fragment>
      <InputField
        name="assessment.description"
        label="common.assessments"
        validate={validator(required)}
      />
      <FieldArray name="assessment.attachments" render={renderAttachments} />
    </React.Fragment>
  );
};

export default AssessmentFormAssessments;
