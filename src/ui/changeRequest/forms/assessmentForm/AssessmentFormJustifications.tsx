import { FieldArray, FieldArrayRenderProps, FieldProps } from "formik";
import React from "react";
import FilledInputField from "../../../components/forms/fields/FilledInput";
import AttachmentsContainer from "../attachments/Attachments.container";
import { ChangeRequestFormValues } from "../types";

interface Props extends FieldProps<ChangeRequestFormValues> {}

const AssessmentFormJustifications: React.FunctionComponent<Props> = () => {
  const renderAttachments = (props: FieldArrayRenderProps) =>
    <AttachmentsContainer attachmentsKey="justifications" {...props} />;

  return (
    <React.Fragment>
      <FilledInputField
        name="justifications.description"
        label="cr.justification"
        inputProps={{ multiline: true, rows: "2" }}
      />
      <FieldArray name="justifications.attachments">
        {renderAttachments}
      </FieldArray>
    </React.Fragment>
  );
};

export default AssessmentFormJustifications;
