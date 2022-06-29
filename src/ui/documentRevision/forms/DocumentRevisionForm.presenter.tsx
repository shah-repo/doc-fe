import { Box, Grid } from "@material-ui/core";
import { FormikProps } from "formik";
import { flatten, isEmpty } from "lodash";
import { Observer, observer } from "mobx-react";
import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { SM } from "../../../App";
import { authSelectors } from "../../../state/ducks/auth";
import { DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, FBOutputDocumentType } from "../../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../../state/ducks/documents";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import FormWrapper from "../../components/forms/FormWrapper";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import ScrollToError from "../../components/forms/ScrollToError";
import BuildsContainer from "../../document.revision/summary/builds.container";
import { FB, FBEBPart, FBWorkspaceMode } from "../../form.builder";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { DocumentCloneType } from "../Clone.container";
import { isOperator } from "../DocumentRevisionDisplay.container";
import { checkIsDocumentDAM, checkIsDocumentEB, checkIsDocumentPart, checkIsDocumentPOAM, checkIsDocumentRecord, checkIsTypeHaveOutput } from "../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft, isDocumentRevisionPendingChange } from "../helpers/documentRevisionStatus";
import { getRevisionStageNumber, isDocumentAlphaReleased } from "../helpers/revisionStage";
import DocIdInput from "./presenters/DocIdInput";
import DocumentSecurity from "./presenters/DocumentSecurity";
import DocumentTypeSelect from "./presenters/DocumentTypeSelect";
import FBActiveNoOutput from "./presenters/FBActiveNoOutput";
import GenerateHtmlPreview from "./presenters/GenerateHtmlPreview";
import RetrainField from "./presenters/RetrainField";
import RevisionStage from "./presenters/RevisionStage";
import RevisionTypeChange from "./presenters/RevisionTypeChange";
import { DocumentRevisionFormValues } from "./types";

interface Props
  extends FormikProps<DocumentRevisionFormValues>
{
  documentRevision: DocumentRevision;
  documentRevisions?: DocumentRevision[];
  showRevisionTypeChange?: boolean;
  proposedDocId?: string;
  setDocId?: typeof documentsActions.setDocumentProposedId;
  documentTypesById: DocumentTypeByIdState;
  canChangeOwnerShip: boolean;
  type?: DocumentCloneType;
  showAdministrativeAndVoidChange: boolean;
  pmFormId?: string;
  releasedDocRev?: DocumentRevision;
  redlineActive: boolean;
  lastSavedTimestamp?: string;
  mode: FBWorkspaceMode;
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
}

const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  initialValues,
  showRevisionTypeChange,
  proposedDocId,
  values,
  setDocId,
  dirty,
  resetForm,
  isSubmitting,
  isValidating,
  errors,
  documentTypesById,
  documentRevision,
  setFieldValue,
  type,
  showAdministrativeAndVoidChange,
  pmFormId,
  releasedDocRev,
  redlineActive,
  mode,
  doNotPrompt,
  onDirtyFlagChange,
}) => {
  useScrollIntoView();
  const { _formState, _documentRevisionFormState } = SM.useStores();
  const intl = useIntl();
  const { workspaceState } = FB.useStores();
  const { revisionChangeType } = values || {};
  const documentTypeById = documentTypesById[values.document?.documentType?.id || ""];
  const { schema = [] } =  workspaceState || {};
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
  const email = useSelector(authSelectors.currentUserEmail);
  const isOwner = documentRevision?.owner ? documentRevision?.owner.user.email === email : true;
  const isDisabled: boolean = initialValues.id !== undefined;
  const isDisabledInput = values.id !== undefined && isCurrentUserOperator && !isOwner;
  const docRevId = documentRevision?.id;
  const documentTypeId = values.document?.documentType?.id || "";
  const defaultRevisionStage = values.document?.documentType?.defaultRevStage || "";

  const shouldShowRevStageForDocType = !isDocumentPOAM && !isDocumentDAM && !isRecord;
  const outputDocumentTypes = pmFormId ?
    initialValues.outputDocumentTypes :
    initialValues.formDocument?.formTemplate?.outputDocumentTypes;

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
      <Grid container spacing={3} md={8} sm={12}>
        <Grid item xs={6}>
          <DocumentTypeSelect
            outputDocumentTypes={outputDocumentTypes as unknown as FBOutputDocumentType[]}
            isDisabled={isDisabledInput}
            {...{
              type,
              isDocRevStatusDraft,
              documentTypeId,
            }}
          />
        </Grid>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
          <RetrainField
            revisionChangeType={values.revisionChangeType}
            isDisabled={isDisabledInput}
            {...{ documentTypeId, isRecord }}
          />
        </Grid>
        {isEB && (
          <Grid item xs={12}>
            <FBEBPart name="childrenParts" />
          </Grid>
        )}
        {isPart && documentRevision?.parentParts && (
          <Grid item xs={12}>
            <BuildsContainer
              dataProp={flatten([documentRevision?.parentParts])}
              label="common.part.of"
              isDraft={isDocRevStatusDraft || isRevised}
            />
          </Grid>
        )}
        {isEB && documentRevision?.parent && (
          <Grid item xs={12}>
            <BuildsContainer
              dataProp={flatten([documentRevision.parent])}
              label="common.previous.build"
              docRevId={docRevId}
              showRemoveButton={isDocRevStatusDraft || isDocRevStatusInPendingChange}
              isDraft={isDocRevStatusDraft || isRevised}
            />
          </Grid>
        )}
        {isEB && documentRevision?.children && (
          <Grid item xs={12}>
            <BuildsContainer
              dataProp={documentRevision.children}
              label="common.next.build"
              isDraft={isDocRevStatusDraft || isRevised}
            />
          </Grid>
        )}
        {showRevisionTypeChange && !isRevisionChangeHidden && !isDocRevFirstDraft && (
          <Grid item xs={12}>
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
          </Grid>
        )}
        {(!values.status || type === "newOutput") && (
          <Grid item xs={12}>
            <DocumentSecurity documentTypeId={documentTypeId} />
          </Grid>
        )}
        {_formState?.active && _formState.mode === "design" && hasOutput && (
          <Grid item xs={12}>
            <FBActiveNoOutput
              docRevId={initialValues.id}
              status={documentRevision?.status}
              version={documentRevision?.version}
              isDisabled={isDisabledInput}
              outputDocs={values.outputDocumentTypes as OptionType[]}
            />
          </Grid>
        )}
        {_formState?.active && documentRevision && values.id && (
          <Grid item xs={12}>
            <Box textAlign="right">
              <GenerateHtmlPreview
                id={values.id}
                renderHTMLDefined={values.formDocument?.renderHTMLDefined}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </FormWrapper>
  );
};

export default observer(DocumentRevisionFormPresenter);
