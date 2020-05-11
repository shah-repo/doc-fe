import { Box, Grid, withStyles, WithStyles } from "@material-ui/core";
import { FormikProps } from "formik";
import { isEmpty } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { DocumentRevision, DocumentRevisionStatus, RevisionStageOptions } from "../../../state/ducks/documentRevisions";
import { DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { AsyncState } from "../../../state/types";
import { default as AutocompleteField } from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types.js";
import SelectField from "../../components/forms/fields/Select";
import { required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import FormWrapper from "../../components/forms/FormWrapper";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import ScrollToError from "../../components/forms/ScrollToError";
import AttachmentsField from "../../document.revision/form/attachments";
import Title from "../../document.revision/form/title";
import { documentDetailsPath } from "../../document.revision/utils/paths";
import FBDRStore from "../../form.builder/stores/ui/FBDRStore";
import FBStore from "../../form.builder/stores/ui/FBStore";
import DocumentRevisionOutputInfo from "../formBuilder/DocumentRevisionOutputInfo";
import styles from "./DocumentRevisionForm.styles";
import DocRevActions from "./presenters/Actions";
import Description from "./presenters/Description";
import DocIdInput from "./presenters/DocIdInput";
import DocumentSecurity from "./presenters/DocumentSecurity";
import DocumentTypeSelect from "./presenters/DocumentTypeSelect";
import FBActiveNoOutput from "./presenters/FBActiveNoOutput";
import GenerateHtmlPreview from "./presenters/GenerateHtmlPreview";
import MemoizedFBWorkspace from "./presenters/MemoizedFBWorkspace";
import References from "./presenters/References";
import RetrainField from "./presenters/RetrainField";
import RevisionTypeChange from "./presenters/RevisionTypeChange";
import { DocumentRevisionFormValues } from "./types";


export interface Props
  extends WithStyles<typeof styles>,
  FormikProps<DocumentRevisionFormValues> {
  asyncState: AsyncState;
  documentRevision: DocumentRevision;
  documentRevisions?: DocumentRevision[];
  availableReferences: OptionType[];
  showRevisionTypeChange?: boolean;
  proposedDocId?: string;
  setDocId?: typeof documentsActions.setDocumentProposedId;
  doNotPrompt?: boolean;
  documentTypesById: DocumentTypeByIdState;
  onDirtyFlagChange?: (dirty: boolean) => void;
  canChangeOwnerShip: boolean;
  type?: string;
}

export const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  classes,
  asyncState,
  initialValues,
  handleChange,
  availableReferences,
  showRevisionTypeChange,
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
  documentTypesById,
  canChangeOwnerShip,
  documentRevision,
  setFieldValue,
  type,
}) => {
  useEffect(() => {
    if (!values.id && !values.document?.documentType?.id) {
      FBDRStore.setMode("none");
      if (setDocId) {
        setDocId("");
      }
    }
  }, [setDocId, values.document, values.id]);
  useEffect(() => {
    if (proposedDocId) {
      setFieldValue("document.docId", proposedDocId);
    }
  }, [proposedDocId, setFieldValue]);
  useEffect(() => {
    if (isEmpty(values.document?.documentType?.id)) {
      setFieldValue("document.docId", "");
    }
  }, [values.document, setFieldValue]);

  const openReference = (documentId: string) => {
    window.open(documentDetailsPath(documentId), "_blank");
  };
  const [docInfo, savedocInfo] = React.useState({ name: "", isQms: true });
  const isDisabled: boolean = initialValues.id !== undefined;
  const isdocRevStatusDraft =
    documentRevision?.status === DocumentRevisionStatus.Draft;
  const documentType = documentTypesById[values.document?.documentType?.id || ""];
  const hasOutput = documentType?.groupOptions?.includes("HAVE_OUTPUT");

  useEffect(() => {
    if (isdocRevStatusDraft) {
      savedocInfo({
        name: values.name,
        isQms: values.document?.documentType?.isQms || false,
      });
    }
  }, [isdocRevStatusDraft, values.document, values.name]);

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
        <Description isQms={docInfo.isQms} />
        <DocumentTypeSelect
          outputDocumentTypes={initialValues.formDocument?.formTemplate?.outputDocumentTypes}
          type={type}
          isdocRevStatusDraft={isdocRevStatusDraft}
          savedocInfo={savedocInfo}
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
        <RetrainField revisionChangeType={values.revisionChangeType} />
        <AttachmentsField />
        {showRevisionTypeChange && <RevisionTypeChange />}
        {
          (!values.status || type === "newOutput") &&
          <DocumentSecurity />
        }
        {
          FBStore.active && !FBDRStore.isOutput && hasOutput &&
          <FBActiveNoOutput
            docRevId={initialValues.id}
            status={documentRevision?.status}
            version={documentRevision?.version}
          />
        }
        {
          FBStore.active &&
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
        }
        <DocRevActions
          documentRevision={documentRevision}
          asyncState={asyncState}
          docInfo={docInfo}
          values={values}
          canChangeOwnerShip={canChangeOwnerShip}
        />
      </FormWrapper>
    </Grid>
  );
};

export default withStyles(styles)(observer(DocumentRevisionFormPresenter));
