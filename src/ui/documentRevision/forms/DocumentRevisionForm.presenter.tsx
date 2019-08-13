
import { Typography, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import {
  DocumentRevision,
  RevisionChangeType,
} from "../../../state/ducks/documentRevisions";
import { documentsActions } from "../../../state/ducks/documents";
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
import FormWrapper from "../../components/forms/FormWrapper";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import AttachmentsField from "../../document.revision/form/attachments";
import { documentRevisionTypeFormOption } from "../../document.revision/utils/helpers";
import {
  documentDetailsPath,
  documentVersionPath,
} from "../../document.revision/utils/paths";
import styles from "./DocumentRevisionForm.styles";
import { DocumentRevisionFormValues } from "./types";

interface Props
  extends WithStyles<typeof styles>,
    FormikProps<DocumentRevisionFormValues> {
  asyncState: AsyncState;
  documentRevisions?: DocumentRevision[];
  availableReferences: OptionType[];
  showRevisionTypeChange?: boolean;
  loadDocumentProposedId: typeof documentsActions.loadDocumentProposedId;
  proposedDocId: string;
  setDocId?: typeof documentsActions.setDocumentProposedId;
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
}

const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  asyncState, classes, initialValues, handleChange, availableReferences, showRevisionTypeChange,
  loadDocumentProposedId, proposedDocId, values, setDocId,
  dirty, resetForm, doNotPrompt, onDirtyFlagChange
}) => {
  const openReference = (documentId: string) => { window.open(documentDetailsPath(documentId), "_blank"); };

  const isDisabled: boolean = initialValues.id !== undefined;
  const docIdValue = isDisabled ? values.document!.docId : proposedDocId;

  if (!isDisabled && values.document) {
    values.document.docId = proposedDocId;
  }

  const handleDocIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const { type } = values.document || {type: undefined};

    if (!values.document && !type) { return; }
    const pattern = new RegExp("^" + type + "\\d{0," + type!.length + "}", "g" );

    if (!pattern.test(value) || !setDocId) { return; }
    setDocId!(value);
  };

  const handleTypeChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const type = event.target.value as string;
    loadDocumentProposedId(type);
    handleChange(event);
  };

  const renderTypeOfRevisionChange = () => {
    if (showRevisionTypeChange) {
      return (
        <React.Fragment>
          <Typography variant="h6">
            <Text translation="documentRevision.form.typeOfRevisionChange" />
          </Typography>
          <RadioGroup name="revisionChangeType" validate={validator(required)}>
            <RadioButton
              label={<Text translation="documentRevision.form.nextRevision" />}
              value={RevisionChangeType.NextRevision}
            />
            <RadioButton
              label={
                <Text translation="documentRevision.form.nextRevisionStage" />
              }
              value={RevisionChangeType.NextRevisionStage}
            />
            <RadioButton
              label={<Text translation="documentRevision.form.obsolete" />}
              value={RevisionChangeType.Obsolete}
            />
          </RadioGroup>
        </React.Fragment>
      );
    }
  };

  const renderReferences = () => {
    if (
      initialValues.document &&
      initialValues.document.referencedBy &&
      initialValues.document.referencedBy.length > 0
    ) {
      return (
        <React.Fragment>
          <Typography variant="h6">
            <Text translation="common.referenced.by" />
          </Typography>
          <div>
            {initialValues.document.referencedBy.map((reference) => {
              return (
                <div key={reference.id}>
                  <Link
                    to={documentVersionPath(reference.id, reference.document.id)}
                    target="_blank"
                  >
                    {reference.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      );
    }
  };

  return (
    <div className={classes.container}>
      <FormWrapper dirty={dirty} initialValues={initialValues} resetForm={resetForm}>
        <PromptIfDirty dirty={dirty} doNotPrompt={doNotPrompt} onDirtyFlagChange={onDirtyFlagChange} />
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        <InputField
          name="name"
          label="document.title"
          inputProps={{ id: "name" }}
          validate={validator(required)}
        />
        <FilledInputField
          name="description"
          label="common.description"
          validate={validator(required)}
          inputProps={{ multiline: true, rows: "2" }}
        />
        <SelectField
          name="document.type"
          label="document.type"
          selectProps={{inputProps: { id: "type", disabled: isDisabled }, onChange: handleTypeChange }}
          options={documentRevisionTypeFormOption()}
          validate={validator(required)}
          includeEmpty={false}
        />
        <InputField
          name="document.docId"
          label="document.revision.list.docId"
          inputProps={{ id: "docId", value: docIdValue, disabled: isDisabled, onChange: handleDocIdChange }}
        />
        <AutcompleteField
          name="referenceTo"
          autocompleteProps={{
            id: "referenceTo",
            isMulti: true,
            placeholder: (
              <Text translation="documentRevision.form.references" />
            ),
            closeMenuOnSelect: false,
          }}
          options={availableReferences}
          onClick={openReference}
        />
        {renderReferences()}
        <AttachmentsField />
        {renderTypeOfRevisionChange()}
        <SubmitButton style={{marginTop: "30px"}} asyncState={asyncState} label="common.save" />
      </FormWrapper>
    </div>
  );
};

export default withStyles(styles)(DocumentRevisionFormPresenter);
