import { Typography, withStyles, WithStyles } from "@material-ui/core";
import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from "formik";
import React from "react";
import documentTypes from "../../../data/documentTypes.json";
import { AsyncState } from "../../../state/types";
import InputField from "../../components/forms/fields/Input";
import SelectField from "../../components/forms/fields/Select";
import { required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import DocumentTransitionDialogContainer from "../dialogs/DocumentTransitionDialog.container";
import AttachmentsContainer from "./attachments/Attachments.container";
import DocumentApprovers from "./DocumentApprovers";
import styles from "./DocumentForm.styles";
import { DocumentFormValues } from "./types.js";

interface Props extends WithStyles<typeof styles>, FormikProps<DocumentFormValues> {
  asyncState: AsyncState;
  documentId?: string;
}

const DocumentFormPresenter: React.FunctionComponent<Props> = ({ asyncState, values, classes, documentId, dirty }) => {
  const renderApprovers = (props: FieldArrayRenderProps) => <DocumentApprovers {...props} />;
  const renderAttachments = (props: FieldArrayRenderProps) => <AttachmentsContainer {...props} />;
  const renderSendToReviewButton = () => {
    if (!documentId) {
      return null;
    }

    return (
      <div className={classes.reviewButton}>
        <DocumentTransitionDialogContainer
          transition="to_review"
          documentId={documentId}
          buttonProps={{ disabled: dirty, color: "secondary" }}
        />
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4">
        <Text translation="document.form.title" values={{ name: values.name || "" }} />
      </Typography>
      <Form>
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        <InputField
          name="name"
          label="document.title"
          inputProps={{ id: "name" }}
          validate={validator(required)}
        />
        <SelectField
          name="type"
          label="document.type"
          selectProps={{ inputProps: { id: "type" } }}
          options={documentTypes}
          validate={validator(required)}
        />
        <FieldArray name="approvers" render={renderApprovers} />
        <FieldArray name="attachments" render={renderAttachments} />
        <SubmitButton asyncState={asyncState} label="document.save" />
      </Form>
      {renderSendToReviewButton()}
    </div>
  );
};

export default withStyles(styles)(DocumentFormPresenter);
