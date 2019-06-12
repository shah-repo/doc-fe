import { FieldArrayRenderProps, FormikProps, FieldArray, FieldProps } from "formik";
import { Typography } from "@material-ui/core";
import React from "react";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";
import InputField from "../../../components/forms/fields/Input";
import { ChangeRequestFormValues } from "../types";
import AttachmentsContainer from '../attachments/Attachments.container';

interface Props extends FieldProps<ChangeRequestFormValues> {}

const AssessmentFormJustifications: React.FunctionComponent<Props> = () => {
  const renderAttachments = (props: FieldArrayRenderProps) => <AttachmentsContainer attachmentsKey="justifications" {...props} />;

  return (
    <React.Fragment>
      <InputField
        name="justifications.description"
        label="changeRequest.assessmentForm.justifications"
      />
      <FieldArray name="justifications.attachments" render={renderAttachments} />
    </React.Fragment>
  );
};

export default AssessmentFormJustifications;
