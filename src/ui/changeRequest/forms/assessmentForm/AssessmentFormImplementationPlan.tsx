import { FieldArrayRenderProps, FieldProps, FieldArray } from "formik";
import { Typography } from "@material-ui/core";
import React from "react";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";
import InputField from "../../../components/forms/fields/Input";
import { ChangeRequestFormValues } from "../types";
import AttachmentsContainer from '../attachments/Attachments.container';

interface Props extends FieldProps<ChangeRequestFormValues> {}

const AssessmentFormImplementationPlan: React.FunctionComponent<Props> = () => {
  const renderAttachments = (props: FieldArrayRenderProps) => <AttachmentsContainer attachmentsKey="implementationPlan" {...props} />;

  return (
    <React.Fragment>
      <InputField
        name="implementationPlan.description"
        label="changeRequest.assessmentForm.implementationPlan"
        validate={validator(required)}
      />
      <FieldArray name="implementationPlan.attachments" render={renderAttachments} />
    </React.Fragment>
  );
};

export default AssessmentFormImplementationPlan;
