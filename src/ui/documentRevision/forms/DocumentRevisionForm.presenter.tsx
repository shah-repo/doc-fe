import { Typography, withStyles, WithStyles } from "@material-ui/core";
import { Field, FieldArray, FieldArrayRenderProps, Form, FormikProps } from "formik";
import React from "react";
import { DocumentRevision, RevisionChangeType } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import AutcompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types.js";
import FilledInputField from "../../components/forms/fields/FilledInput";
import InputField from "../../components/forms/fields/Input";
import RadioButton from "../../components/forms/fields/RadioButton";
import RadioGroup from "../../components/forms/fields/RadioGroup";
import SelectField from "../../components/forms/fields/Select";
import { required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import { documentRevisionTypeFormOption } from "../../document.revision/utils/helpers";
import AttachmentsContainer from "../../documents/forms/attachments/Attachments.container";
import { documentRevisionIdMask } from "../helpers";
import styles from "./DocumentRevisionForm.styles";
import { DocumentRevisionFormValues } from "./types";

interface Props extends WithStyles<typeof styles>, FormikProps<DocumentRevisionFormValues> {
  asyncState: AsyncState;
  documentRevisions?: DocumentRevision[];
  availableReferences: OptionType[];
  showRevisionTypeChange?: boolean;
}

const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  asyncState, classes, initialValues, handleChange, setFieldValue, documentRevisions,
  availableReferences, showRevisionTypeChange,
}) => {
  const renderAttachments = (props: FieldArrayRenderProps) => <AttachmentsContainer {...props} />;

  const onTypeChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const type = event.target.value as string;
    const docIdGen = documentRevisionIdMask(type, revisionOrdinalNumber(type));
    handleChange(event);
    setFieldValue("documentId", docIdGen);
  };

  const revisionOrdinalNumber = (type: string) => {
    return (documentRevisions || []).length + 1;
  };

  const renderTypeOfRevisionChange = () => {
    if (showRevisionTypeChange) {
      return (
        <React.Fragment>
          <Typography variant="h6" >
            <Text translation="documentRevision.form.typeOfRevisionChange" />
          </Typography>
          <RadioGroup name="revisionChangeType" validate={validator(required)} >
            <RadioButton label={<Text translation="documentRevision.form.nextRevision" />} value={RevisionChangeType.NextRevision} />
            <RadioButton label={<Text translation="documentRevision.form.nextRevisionStage" />} value={RevisionChangeType.NextRevisionStage} />
            <RadioButton label={<Text translation="documentRevision.form.obsolete" />} value={RevisionChangeType.Obsolete} />
          </RadioGroup>
        </React.Fragment>
      );
    }
  };

  const renderReferences = () => {
    if (initialValues.referencedBy.length > 0) {
      return (
        <React.Fragment>
          <Typography variant="h6" >
            <Text translation="common.referenced.by" />
          </Typography>
          <div>
            {initialValues.referencedBy.map((reference) => reference.name)}
          </div>
        </React.Fragment>
      );
    }
  };

  return (
    <div className={classes.container}>
      <Form>
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        <FilledInputField
          name="description"
          label="common.description"
          validate={validator(required)}
          inputProps={{ multiline: true, rows: "2" }}
        />
        <InputField
          name="name"
          label="common.name"
          inputProps={{ id: "name" }}
          validate={validator(required)}
        />
        <SelectField
          name="document.type"
          label="document.type"
          selectProps={{inputProps: { id: "type", disabled: initialValues.id && true }, onChange: onTypeChange }}
          options={documentRevisionTypeFormOption()}
          validate={validator(required)}
          includeEmpty={false}
        />
        <InputField
          name="documentId"
          inputProps={{ id: "documentId", disabled: true, placeholder: "Document ID" }}
        />
        <AutcompleteField
          name="referenceTo"
          autocompleteProps={{
            id: "referenceTo",
            isMulti: true,
            placeholder: <Text translation="documentRevision.form.references" />,
          }}
          options={availableReferences}
        />
        {renderReferences()}
        <FieldArray name="attachments" render={renderAttachments} />
        {renderTypeOfRevisionChange()}
        <SubmitButton asyncState={asyncState} label="common.save" />
      </Form>
    </div>
  );
};

export default withStyles(styles)(DocumentRevisionFormPresenter);
