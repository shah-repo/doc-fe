import { Box } from "@material-ui/core";
import { FormikProps } from "formik";
import { flatten, isEmpty } from "lodash";
import { Observer, observer } from "mobx-react";
import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { SM } from "../../../App";
import { DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, FBOutputDocumentType } from "../../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../../state/ducks/documents";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import FormWrapper from "../../components/forms/FormWrapper";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import ScrollToError from "../../components/forms/ScrollToError";
import AttachmentsField from "../../document.revision/form/attachments";
import BuildsContainer from "../../document.revision/summary/builds.container";
import { FB, FBEBPart, FBWorkspaceMode } from "../../form.builder";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { DocumentCloneType } from "../Clone.container";
import { isOperator } from "../DocumentRevisionDisplay.container";
import { checkIsDocumentDAM, checkIsDocumentEB, checkIsDocumentPart, checkIsDocumentPOAM, checkIsDocumentRecord, checkIsTypeHaveOutput } from "../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft, isDocumentRevisionPendingChange } from "../helpers/documentRevisionStatus";
import { getRevisionStageNumber, isDocumentAlphaReleased } from "../helpers/revisionStage";
import AvailableReferencesField from "./presenters/AvailableReferences";
import DocIdInput from "./presenters/DocIdInput";
import DocumentSecurity from "./presenters/DocumentSecurity";
import DocumentTypeSelect from "./presenters/DocumentTypeSelect";
import FBActiveNoOutput from "./presenters/FBActiveNoOutput";
import GenerateHtmlPreview from "./presenters/GenerateHtmlPreview";
import RetrainField from "./presenters/RetrainField";
import RevisionStage from "./presenters/RevisionStage";
import RevisionTypeChange from "./presenters/RevisionTypeChange";
import { DocumentRevisionFormValues } from "./types";

type Props =
& FormikProps<DocumentRevisionFormValues>
& {
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
  type?: DocumentCloneType;
  bannerPortal?: React.MutableRefObject<HTMLDivElement | null>;
  isNewVersion?: boolean;
  showAdministrativeAndVoidChange: boolean;
  pmFormId?: string;
  releasedDocRev?: DocumentRevision;
  redlineActive: boolean;
  lastSavedTimestamp?: string;
  mode: FBWorkspaceMode;
  isDisabled: boolean;
  email: string;
  isOwner: boolean;
};

export interface FormHeaderContext {
  documentRevision: DocumentRevision;
  canChangeOwnerShip: boolean;
  values: DocumentRevisionFormValues;
  docInfo: any;
  isDisabled: boolean;
  email: string;
  isOwner: boolean;
}

const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  initialValues,
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
  documentRevision,
  setFieldValue,
  type,
  isNewVersion = false,
  showAdministrativeAndVoidChange,
  pmFormId,
  releasedDocRev,
  redlineActive,
  isDisabled,
  isOwner,
  mode,
}) => {
  useScrollIntoView();
  const { _formState, _documentRevisionFormState } = SM.useStores();
  const intl = useIntl();
  const { workspaceState } = FB.useStores();

  const { revisionChangeType } = values || {};
  const documentTypeById = documentTypesById[values.document?.documentType?.id || ""];
  const schema = _documentRevisionFormState?.schema;
  const hasOutput = useMemo(() =>
    checkIsTypeHaveOutput(documentTypeById?.groupOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  , [documentTypesById, values.document?.documentType?.id]);

  const isRecord = useMemo(() =>
    checkIsDocumentRecord(documentTypeById?.groupOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  , [documentTypesById, values.document?.documentType?.id]);

  const isCurrentUserOperator = React.useContext(isOperator);
  const groupOptions = documentRevision?.document.documentType.groupOptions;
  // MARK: @helpers
  const isDocRevStatusDraft = isDocumentRevisionInDraft(documentRevision?.status);
  const isDocRevStatusInPendingChange = isDocumentRevisionPendingChange(documentRevision?.status);
  const isEB = checkIsDocumentEB(groupOptions);
  const isDocumentPOAM = checkIsDocumentPOAM(groupOptions);
  const isDocumentDAM = checkIsDocumentDAM(groupOptions);
  const isAlphaReleased = isDocumentAlphaReleased(documentRevision?.revisionStage);
  const isPart = checkIsDocumentPart(groupOptions);
  const isDocRevFirstDraft = (isDocRevStatusDraft || isDocRevStatusInPendingChange) && documentRevision?.version === 1;
  const isSubrevision = documentRevision?.subRevision as number > 0;
  const isRevisionChangeHidden = isRecord && isDocRevStatusDraft && !isSubrevision;
  const isRevised = values.outputRevision;


  const isDisabledInput = values.id !== undefined && isCurrentUserOperator && !isOwner;
  const docRevId = documentRevision?.id;
  const isAttachmentEmpty = !(documentRevision?.attachments?.length > 1);
  const documentTypeId = values.document?.documentType?.id || "";
  const defaultRevisionStage = values.document?.documentType?.defaultRevStage || "";

  const shouldShowRevStageForDocType = !isDocumentPOAM && !isDocumentDAM && !isRecord;
  const outputDocumentTypes = pmFormId ?
    initialValues.outputDocumentTypes :
    initialValues.formDocument?.formTemplate?.outputDocumentTypes;
  const documentReferences = documentRevision?.referenceTo;

  useEffect(() => {
    if (!redlineActive) {
      return;
    }
    setFieldValue("schema", schema);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redlineActive, schema]);

  useEffect(() => {
    if (!values.id && !values.document?.documentType?.id && setDocId) {
      setDocId("");
    }
  }, [setDocId, values.document, values.id]);

  useEffect(() => {
    if (proposedDocId) {
      setFieldValue("document.docId", proposedDocId);
    }

    if (!isEmpty(documentTypeById?.defaultRevStage) && values.document?.docId === "") {
      const value = getRevisionStageNumber(intl, documentTypeById?.defaultRevStage as string);
      _documentRevisionFormState?.setForceRender(value);
      setFieldValue("revisionStage", value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposedDocId, setFieldValue]);

  useEffect(() => {
    if (isEmpty(values.document?.documentType?.id)) {
      setFieldValue("document.docId", "");
    }
  }, [values.document, setFieldValue]);

  useEffect(() => {
    if (isDocRevStatusDraft) {
      _documentRevisionFormState?.setDocInfo({
        name: values.name,
        isQms: values.document?.documentType?.isQms || false,
        needsSignature: values.document?.documentType?.needsSignature || false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDocRevStatusDraft, values.document, values.name]);

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (revisionChangeType) {
      _documentRevisionFormState?.setDocumentRevisionChangeType(revisionChangeType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revisionChangeType]);

  SM.reaction(
    () => _formState?.isDirty,
    (isDirty: boolean | undefined) => {
      dirty = isDirty || false;
    }
  );

  useEffect(() => {
    workspaceState?.setMode(mode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
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
      <DocumentTypeSelect
        outputDocumentTypes={outputDocumentTypes as unknown as FBOutputDocumentType[]}
        isDisabled={isDisabledInput}
        {...{
          type,
          isDocRevStatusDraft,
          documentTypeId,
        }}
      />
      <DocIdInput
        document={values.document}
        {...{
          isDisabled,
          documentTypesById,
          setDocId,
          documentTypeId,
          type,
        }}
      />
      {isEB && <FBEBPart name="childrenParts" />}
      {isPart && documentRevision?.parentParts && (
        <BuildsContainer
          dataProp={flatten([documentRevision?.parentParts])}
          label="common.part.of"
          isDraft={isDocRevStatusDraft || isRevised}
        />
      )}
      {isEB && documentRevision?.parent && (
        <BuildsContainer
          dataProp={flatten([documentRevision.parent])}
          label="common.previous.build"
          docRevId={docRevId}
          showRemoveButton={isDocRevStatusDraft || isDocRevStatusInPendingChange}
          isDraft={isDocRevStatusDraft || isRevised}
        />
      )}
      {isEB && documentRevision?.children && (
        <BuildsContainer
          dataProp={documentRevision.children}
          label="common.next.build"
          isDraft={isDocRevStatusDraft || isRevised}
        />
      )}
      {/* hack for rerender revision stage */}
      <Observer>
        {() => (
          <>
            {_documentRevisionFormState?.forceRender &&
          <RevisionStage {...{
            isDisabled,
            isDocRevFirstDraft,
            shouldShowRevStageForDocType,
            documentTypeId,
            defaultRevisionStage,
          }}/>}
            {!_documentRevisionFormState?.forceRender &&
          <RevisionStage {...{
            isDisabled,
            isDocRevFirstDraft,
            shouldShowRevStageForDocType,
            documentTypeId,
            defaultRevisionStage,
          }}/>}
          </>
        )}
      </Observer>
      {type === "none" && <AvailableReferencesField
        availableReferences={availableReferences}
        documentReferences={documentReferences}
        name="referenceTo"
        label="documentRevision.form.references"
        disabled={isDisabledInput}
        documentGroupOptions={groupOptions}
      />}
      <RetrainField
        revisionChangeType={values.revisionChangeType}
        isDisabled={isDisabledInput}
        {...{ documentTypeId, isRecord }}
      />
      <AttachmentsField
        isDisabled={isDisabledInput}
        isNewVersion={isNewVersion}
        docRevId = {docRevId}
        isAttachmentEmpty = {isAttachmentEmpty}
        containsRedline = {false}
        docRevStatus = {documentRevision?.status}
        documentRevision={documentRevision}
        documentTypeId={documentTypeId || ""}
      />
      {showRevisionTypeChange && !isRevisionChangeHidden && !isDocRevFirstDraft &&
        <RevisionTypeChange
          isDisabled={isDisabledInput}
          {...{
            documentTypeId,
            isDocRevFirstDraft,
            showAdministrativeAndVoidChange,
            isRecord,
            releasedDocRev,
            isAlphaReleased,
          }}
        />
      }
      {
        (!values.status || type === "newOutput") &&
          <DocumentSecurity documentTypeId={documentTypeId} />
      }
      {
          _formState?.active && _formState.mode === "design" && hasOutput &&
          <FBActiveNoOutput
            docRevId={initialValues.id}
            status={documentRevision?.status}
            version={documentRevision?.version}
            isDisabled={isDisabledInput}
            outputDocs={values.outputDocumentTypes as OptionType[]}
          />
      }
      {
          _formState?.active &&
          <Box mt={5}>
            {
              values.id &&
              <Box textAlign="right">
                <GenerateHtmlPreview id={values.id} renderHTMLDefined={values.formDocument?.renderHTMLDefined} />
              </Box>
            }
          </Box>
      }
    </FormWrapper>
  );
};

export default (observer(DocumentRevisionFormPresenter));
