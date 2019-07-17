import { FieldArray, FieldArrayRenderProps, FieldProps } from "formik";
import { Field } from "formik";
import React from "react";
import TextField from "../../../components/forms/fields/TextField";
import AttachmentsContainer from "../attachments/Attachments.container";
import { ChangeRequestFormValues } from "../types";

interface Props extends FieldProps<ChangeRequestFormValues> {}

const AssessmentFormJustifications: React.FunctionComponent<Props> = () => {
  const renderAttachments = (props: FieldArrayRenderProps) =>
    <AttachmentsContainer attachmentsKey="justifications" {...props} />;

  return (
    <React.Fragment>
      <Field
        component={TextField}
        name="justifications.description"
        label="common.justifications"
      />
      <FieldArray name="justifications.attachments" render={renderAttachments} />
    </React.Fragment>
  );
};

export default AssessmentFormJustifications;
