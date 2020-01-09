import { Box, Grid, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import _ from "lodash";
import { observer } from "mobx-react";
import React from "react";
import {
  DocumentRevision,
  RevisionStageOptions,
} from "../../../state/ducks/documentRevisions";
import { DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { AsyncState } from "../../../state/types";
import OwnerChanger from "../../components/common/owner.changer/container";
import AutcompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types.js";
import CheckboxField from "../../components/forms/fields/Checkbox";
import InputField from "../../components/forms/fields/Input";
import SelectField, {
  SelectOption,
} from "../../components/forms/fields/Select";
import TextEditorField from "../../components/forms/fields/TextEditor";
import { required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import FormWrapper from "../../components/forms/FormWrapper";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import ScrollToError from "../../components/forms/ScrollToError";
import SubmitButton from "../../components/forms/SubmitButton";
import AttachmentsField from "../../document.revision/form/attachments";
import Title from "../../document.revision/form/title";
import { documentDetailsPath } from "../../document.revision/utils/paths";
import FBWorkspace from "../../form.builder/main/workspace/FBWorkspace";
import FBDRStore from "../../form.builder/stores/FBDRStore";
import FBStore from "../../form.builder/stores/FBStore";
import DocumentRevisionOutputInfo from "../formBuilder/DocumentRevisionOutputInfo";
import styles from "./DocumentRevisionForm.styles";
import References from "./presenters/References";
import RevisionTypeChange from "./presenters/RevisionTypeChange";
import { DocumentRevisionFormValues } from "./types";

export interface Props
  extends WithStyles<typeof styles>,
    FormikProps<DocumentRevisionFormValues> {
  asyncState: AsyncState;
  documentRevisions?: DocumentRevision[];
  availableReferences: OptionType[];
  showRevisionTypeChange?: boolean;
  loadDocumentProposedId?: typeof documentsActions.loadDocumentProposedId;
  proposedDocId?: string;
  setDocId?: typeof documentsActions.setDocumentProposedId;
  doNotPrompt?: boolean;
  documentTypes: SelectOption[];
  otherDocumentTypes: SelectOption[];
  documentTypesById: DocumentTypeByIdState;
  onDirtyFlagChange?: (dirty: boolean) => void;
  canChangeOwnerShip: boolean;
}

export const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  classes,
  asyncState,
  initialValues,
  handleChange,
  availableReferences,
  showRevisionTypeChange,
  loadDocumentProposedId,
  proposedDocId,
  values,
  setDocId,
  dirty,
  resetForm,
  doNotPrompt,
  onDirtyFlagChange,
  isSubmitting,
  isValidating,
  errors,
  documentTypes,
  documentTypesById,
  otherDocumentTypes,
  canChangeOwnerShip,
}) => {
  if (!values.id && !_.get(values, "document.documentType.id")) {
    FBDRStore.setMode("none");
    if (setDocId) {
      setDocId("");
    }
  }

  const openReference = (documentId: string) => {
    window.open(documentDetailsPath(documentId), "_blank");
  };

  const isDisabled: boolean = _.get(initialValues, "id") !== undefined;
  const docId = _.get(initialValues, "document.docId");
  const useProposedDocId = (!docId || docId === "") && values.document;
  values.document!.docId = useProposedDocId
    ? proposedDocId
    : values.document!.docId;

  const handleDocIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const { documentType } = values.document || {};

    if (!documentType) {
      return;
    }
    const type = documentTypesById[documentType.id!].documentTypeAcronym;

    if (!values.document && !type) {
      return;
    }
    const pattern = new RegExp("^" + type + "\\d{0," + type!.length + "}", "g");

    if (!pattern.test(value) || !setDocId) {
      return;
    }
    setDocId!(value);
  };

  const handleTypeChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const typeId = event.target.value as string;
    const type = documentTypesById[typeId] || {};
    if (loadDocumentProposedId) {
      loadDocumentProposedId(type.documentTypeAcronym);
    }
    FBDRStore.setInitialFBMode(type.group);
    handleChange(event);
  };

  const renderTypeOfRevisionChange = showRevisionTypeChange && (
    <RevisionTypeChange />
  );

  const renderRevisionStageDropdown = !isDisabled && (
    <SelectField
      name="revisionStage"
      label="document.revision.stage"
      selectProps={{ inputProps: { id: "revisionStage" } }}
      options={RevisionStageOptions}
      validate={validator(required)}
      includeEmpty={false}
    />
  );

  return (
    <Grid
      item={true}
      className={classes.container}
      lg={isDisabled ? 12 : 7}
      sm={isDisabled ? 12 : 10}
      xs={12}
    >
      {FBDRStore.isOutput && (
        <DocumentRevisionOutputInfo
          dataProp={(values as unknown) as DocumentRevision}
        />
      )}
      <FormWrapper
        dirty={dirty}
        initialValues={initialValues}
        resetForm={resetForm}
      >
        <ScrollToError
          isSubmitting={isSubmitting}
          isValidating={isValidating}
          errors={errors}
        />
        <PromptIfDirty
          dirty={dirty}
          doNotPrompt={doNotPrompt}
          onDirtyFlagChange={onDirtyFlagChange}
        />
        <FormMessage asyncState={asyncState} />
        <FormProgress asyncState={asyncState} />
        <Title name="name" label="common.title" />
        <TextEditorField
          name="description"
          label="common.description"
          validate={validator(required)}
        />
        <SelectField
          name="document.documentType.id"
          label="document.type"
          selectProps={{
            inputProps: { id: "documentType", disabled: isDisabled },
            onChange: handleTypeChange,
          }}
          options={documentTypes}
          validate={validator(required)}
          includeEmpty={false}
        />
        <InputField
          name="document.docId"
          label="common.documentId"
          inputProps={{
            id: "document.docId",
            value: values.document!.docId,
            disabled: isDisabled,
            onChange: handleDocIdChange,
          }}
        />
        {renderRevisionStageDropdown}
        <AutcompleteField
          name="referenceTo"
          label="documentRevision.form.references"
          autocompleteProps={{
            id: "referenceTo",
            isMulti: true,
            closeMenuOnSelect: false,
          }}
          options={availableReferences}
          onClick={openReference}
        />
        <References document={initialValues.document} />
        <CheckboxField
          name="retrain"
          label="document.revision.trainingRequired"
        />
        <AttachmentsField />
        {renderTypeOfRevisionChange}
        {FBStore.active && !FBDRStore.isOutput && (
          <Box mt={4}>
            <SelectField
              name="formTemplate.outputDocumentType.id"
              label="document.output.type"
              selectProps={{
                inputProps: { id: "formTemplate.outputDocumentType" },
              }}
              options={otherDocumentTypes}
              includeEmpty={false}
              validate={validator(required)}
            />
          </Box>
        )}
        {FBStore.active && (
          <Box mt={5}>
            <FBWorkspace />
          </Box>
        )}
        <Box mt={5}>
          <Grid container={true} alignItems="flex-end" direction="column">
            {canChangeOwnerShip && (
              <OwnerChanger
                requestId={values.id!}
                requestType={"document"}
              />
            )}
            <SubmitButton
              asyncState={asyncState}
              label={isDisabled ? "common.save" : "navigation.createDocument"}
            />
          </Grid>
        </Box>
      </FormWrapper>
    </Grid>
  );
};

export default withStyles(styles)(observer(DocumentRevisionFormPresenter));
