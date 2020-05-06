import { Box, Grid, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import { isEmpty } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType, RevisionStageOptions } from "../../../state/ducks/documentRevisions";
import { DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { AsyncState } from "../../../state/types";
import OwnerChanger from "../../components/common/owner.changer/container";
import { RequestType } from "../../components/common/owner.changer/helpers/types";
import { default as AutocompleteField } from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types.js";
import CheckboxField from "../../components/forms/fields/Checkbox";
import RichTextEditor from "../../components/forms/fields/RichTextEditor";
import SelectField, { SelectOption } from "../../components/forms/fields/Select";
import { required, requiredAtLeastOne, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import FormWrapper from "../../components/forms/FormWrapper";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import ScrollToError from "../../components/forms/ScrollToError";
import SubmitButton from "../../components/forms/SubmitButton";
import AttachmentsField from "../../document.revision/form/attachments";
import Title from "../../document.revision/form/title";
import { documentDetailsPath } from "../../document.revision/utils/paths";
import { FBValidate } from "../../form.builder/defaults/validator";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import FBStore from "../../form.builder/stores/ui/FBStore";
import DocumentRevisionOutputInfo from "../formBuilder/DocumentRevisionOutputInfo";
import styles from "./DocumentRevisionForm.styles";
import ApproveAndRelease from "./presenters/ApproveAndRelease";
import CancelButton from "./presenters/CancelButton";
import DocIdInput from "./presenters/DocIdInput";
import DocumentTypeSelect from "./presenters/DocumentTypeSelect";
import GenerateHtmlPreview from "./presenters/GenerateHtmlPreview";
import MemoizedFBWorkspace from "./presenters/MemoizedFBWorkspace";
import References from "./presenters/References";
import RenderHtmlField from "./presenters/RenderHtmlField";
import RevisionTypeChange from "./presenters/RevisionTypeChange";
import SecurityEmployees from "./presenters/SecurityEmployees";
import SecurityGroups from "./presenters/SecurityGroups";
import UpgradeToLatest from "./presenters/UpgradeToLatest";
import { DocumentRevisionFormValues } from "./types";


export interface Props
  extends WithStyles<typeof styles>,
  FormikProps<DocumentRevisionFormValues> {
  asyncState: AsyncState;
  documentRevision: DocumentRevision;
  documentRevisions?: DocumentRevision[];
  availableReferences: OptionType[];
  showRevisionTypeChange?: boolean;
  loadDocumentProposedId?: typeof documentsActions.loadDocumentProposedId;
  proposedDocId?: string;
  setDocId?: typeof documentsActions.setDocumentProposedId;
  doNotPrompt?: boolean;
  documentTypes: SelectOption[];
  outputDocumentTypeOptions: OptionType[];
  documentTypesById: DocumentTypeByIdState;
  onDirtyFlagChange?: (dirty: boolean) => void;
  canChangeOwnerShip: boolean;
  type?: string;
}

export const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  classes,
  asyncState,
  initialValues,
  // TODO: check handleChange
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
  outputDocumentTypeOptions,
  canChangeOwnerShip,
  documentRevision,
  setFieldValue,
  type,
}) => {
  if (!values.id && !values.document?.documentType?.id) {
    FBDRStore.setMode("none");
    if (setDocId) {
      setDocId("");
    }
  }

  const openReference = (documentId: string) => {
    window.open(documentDetailsPath(documentId), "_blank");
  };
  const isDisabled: boolean = initialValues.id !== undefined;
  const isdocRevVersionOne = documentRevision?.version === 1;
  const isdocRevStatusDraft =
    documentRevision?.status === DocumentRevisionStatus.Draft;
  const outputDocEnabled: boolean =
    (isdocRevVersionOne && isdocRevStatusDraft) || !isDisabled;

  useEffect(() => {
    if (proposedDocId) {
      setFieldValue("document.docId", proposedDocId);
    }
    if (isEmpty(values.document?.documentType?.id)) {
      setFieldValue("document.docId", "");
    }
  }, [values.document, proposedDocId, setFieldValue]);

  const [docInfo, savedocInfo] = React.useState({ name: "", isQms: true });

  useEffect(() => {
    if (isdocRevStatusDraft) {
      savedocInfo({
        name: values.name,
        isQms: values.document?.documentType?.isQms || false,
      });
    }
  }, [isdocRevStatusDraft, values.document, values.name]);

  useEffect(() => {
    if (values.revisionChangeType === RevisionChangeType.AdministrativeChange) {
      setFieldValue("retrain", false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.revisionChangeType]);

  const onFormClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    FBValidate();
  };

  const renderChangeOwnership = canChangeOwnerShip && values.id && (
    <OwnerChanger requestId={values.id} requestType={RequestType.Document} />
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
      {
        FBDRStore.isOutput &&
        <DocumentRevisionOutputInfo formDocument={values.formDocument} />
      }
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
        <RichTextEditor
          name="description"
          label="common.description"
          validate={docInfo.isQms ? validator(required) : undefined}
          editorProps={{
            placeholder: docInfo.isQms
              ? ""
              : "Optional: Title will be used if description not provided.",
          }}
        />
        <DocumentTypeSelect
          outputDocumentTypes={initialValues.formDocument?.formTemplate?.outputDocumentTypes}
          type={type}
          isdocRevStatusDraft={isdocRevStatusDraft}
          // TODO: check handleChange
          handleChange={handleChange}
          savedocInfo={savedocInfo}
          setFieldValue={setFieldValue}
        />
        <DocIdInput
          document={values.document}
          isDisabled={isDisabled}
          documentTypesById={documentTypesById}
          setDocId={setDocId}
        />
        {renderRevisionStageDropdown}
        <AutocompleteField
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
          checkboxProps={{
            disabled: values.revisionChangeType === RevisionChangeType.AdministrativeChange,
          }}
        />
        <AttachmentsField />
        {showRevisionTypeChange && <RevisionTypeChange />}
        {
          (!values.status || type === "newOutput") &&
          <SecurityEmployees />
        }
        {
          (!values.status || type === "newOutput") &&
          <SecurityGroups />
        }
        {FBStore.active && !FBDRStore.isOutput && (
          <Box mt={4}>
            <AutocompleteField
              name="formTemplate.outputDocumentTypes"
              label="document.output.type"
              autocompleteProps={{
                id: "formTemplate.outputDocumentTypes",
                isMulti: true,
                closeMenuOnSelect: false,
                className: !outputDocEnabled ? classes.outputGrey : "",
              }}
              options={outputDocumentTypeOptions}
              validate={validator(requiredAtLeastOne)}
            />
            <RenderHtmlField />
          </Box>
        )}
        {FBStore.active && (
          <Box mt={5}>
            {
              values.id &&
              <Box textAlign="right">
                <GenerateHtmlPreview id={values.id} renderHTML={values.formDocument?.renderHTML} />
              </Box>
            }
            <MemoizedFBWorkspace
              id={values.id}
              documentId={values.formDocument?.document?.id || values.document?.id}
              document={values as unknown as DocumentRevision}
            />
          </Box>
        )}
        <Box mt={5}>
          <Grid
            container={true}
            alignItems="flex-end"
            justify="flex-end"
            direction="row"
          >
            <CancelButton
              documentStatus={documentRevision?.status}
              version={documentRevision?.version}
              docRevId={documentRevision?.id}
            />
            {renderChangeOwnership}
            <SubmitButton
              asyncState={asyncState}
              label={isDisabled ?
                `common.save.${values.document?.documentType?.documentTypeAcronym}` :
                "navigation.createDocument"
              }
              onClick={onFormClick}
              id="DocumentRevisionForm-submit"
            />
            <UpgradeToLatest
              documentStatus={documentRevision?.formDocument?.status}
              formDocumentId={documentRevision?.formDocument?.document?.id}
              docRevId={documentRevision?.id}
              formDocumentStatus={documentRevision?.formDocument?.status}
            />
            <ApproveAndRelease
              id={values.id}
              status={values.status}
              isQms={docInfo.isQms}
              documentName={docInfo.name}
              docRevId={values.id as string}
            />
          </Grid>
        </Box>
      </FormWrapper>
    </Grid>
  );
};

export default withStyles(styles)(observer(DocumentRevisionFormPresenter));
