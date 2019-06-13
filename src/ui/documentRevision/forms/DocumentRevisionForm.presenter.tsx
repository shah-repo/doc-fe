import { withStyles, WithStyles } from "@material-ui/core";
import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from "formik";
import React, { ChangeEvent } from "react";
import documentTypes from "../../../data/documentTypes.json";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import InputField from "../../components/forms/fields/Input";
import SelectField from "../../components/forms/fields/Select";
import { required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import AttachmentsContainer from "../../documents/forms/attachments/Attachments.container";
import { documentRevisionIdMask } from "../helpers";
import styles from "./DocumentRevisionForm.styles";
import { DocumentRevisionFormValues } from "./types";

interface Props extends WithStyles<typeof styles>, FormikProps<DocumentRevisionFormValues> {
  asyncState: AsyncState;
  documentRevisions?: DocumentRevision[];
}

const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  classes,
  initialValues,
  handleChange,
  setFieldValue,
  documentRevisions,
}) => {
  const renderAttachments = (props: FieldArrayRenderProps) => <AttachmentsContainer {...props} />;

  const onTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    const docIdGen = documentRevisionIdMask(type, revisionTypeCount(type));
    handleChange(event);
    setFieldValue("documentId", docIdGen);
  };

  const revisionTypeCount = (type: string) => {
    const revisions = (documentRevisions || []).filter( (p) => p.type.includes(type));
    return (revisions.length + 1);
  };

  return (
    <div className={classes.container}>
      <Form>
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        <InputField
          name="description"
          label="common.description"
          inputProps={{ id: "description" }}
          validate={validator(required)}
        />
        <InputField
          name="name"
          label="common.name"
          inputProps={{ id: "name" }}
          validate={validator(required)}
        />
        <SelectField
          name="type"
          label="document.type"
          selectProps={{inputProps: { id: "type", disabled: initialValues.id && true }, onChange: onTypeChange }}
          options={documentTypes}
          validate={validator(required)}
        />
        <InputField
          name="documentId"
          inputProps={{ id: "documentId", disabled: true, placeholder: "Document ID" }}
        />
        <FieldArray name="attachments" render={renderAttachments} />
        <SubmitButton asyncState={asyncState} label="common.save" />
      </Form>
    </div>
  );
};

export default withStyles(styles)(DocumentRevisionFormPresenter);
