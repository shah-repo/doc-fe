import { Box, Grid } from "@material-ui/core";
import { FormikProps } from "formik";
import { flatten, isEmpty } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { DocumentRevision, FBOutputDocumentType } from "../../../state/ducks/documentRevisions";
import { DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { AsyncState } from "../../../state/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types.js";
import FormWrapper from "../../components/forms/FormWrapper";
import PromptIfDirty from "../../components/forms/PromptIfDirty";
import ScrollToError from "../../components/forms/ScrollToError";
import AttachmentsField from "../../document.revision/form/attachments";
import Title from "../../document.revision/form/title";
import FormHeader from "../../document.revision/header/FormHeader";
import BuildsContainer from "../../document.revision/summary/builds.container";
import { FB, FBEBPart } from "../../form.builder";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { DocumentCloneType } from "../Clone.container";
import { isOperator } from "../DocumentRevisionDisplay.container";
import DocumentRevisionOutputInfo from "../formBuilder/DocumentRevisionOutputInfo";
import { checkIsDocumentDAM, checkIsDocumentEB, checkIsDocumentEquipment, checkIsDocumentPart, checkIsDocumentPOAM, checkIsDocumentRecord, checkIsTypeHaveOutput } from "../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft, isDocumentRevisionPendingChange } from "../helpers/documentRevisionStatus";
import { isDocumentAlphaReleased } from "../helpers/revisionStage";
import { styles } from "./DocumentRevisionForm.styles";
import AvailableReferencesField from "./presenters/AvailableReferences";
import Description from "./presenters/Description";
import DocIdInput from "./presenters/DocIdInput";
import DocumentSecurity from "./presenters/DocumentSecurity";
import DocumentTypeSelect from "./presenters/DocumentTypeSelect";
import FBActiveNoOutput from "./presenters/FBActiveNoOutput";
import GenerateHtmlPreview from "./presenters/GenerateHtmlPreview";
import References from "./presenters/References";
import RetrainField from "./presenters/RetrainField";
import RevisionStage from "./presenters/RevisionStage";
import RevisionTypeChange from "./presenters/RevisionTypeChange";
import UpgradeToLatestContainer from "./presenters/upgrade.to.latest/UpgradeToLatest.container";
import { DocumentRevisionFormValues } from "./types";

export interface Props extends FormikProps<DocumentRevisionFormValues> {
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
  type?: DocumentCloneType;
  handleFBContainerRef?: (instance: HTMLDivElement | null) => any;
  FBContainer?: React.MutableRefObject<HTMLDivElement | null>;
  bannerPortal?: React.MutableRefObject<HTMLDivElement | null>;
  isNewVersion?: boolean;
  showAdministrativeAndVoidChange: boolean;
  pmFormId?: string;
  releasedDocRev?: DocumentRevision;
}

export interface FormHeaderContext {
  documentRevision: DocumentRevision;
  canChangeOwnerShip: boolean;
  values: DocumentRevisionFormValues;
  docInfo: any;
  isDisabled: boolean;
  asyncState: AsyncState;
  type?: DocumentCloneType;
}

export let FormHeaderContext = React.createContext<FormHeaderContext | undefined>(undefined);
export let isOwnerContext = React.createContext<boolean>(false);
export let documentTypeContext = React.createContext<string | undefined>(undefined);

export const DocumentRevisionFormPresenter: React.FunctionComponent<Props> = ({
  asyncState,
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
  canChangeOwnerShip,
  documentRevision,
  setFieldValue,
  type,
  FBContainer,
  bannerPortal,
  isNewVersion = false,
  showAdministrativeAndVoidChange,
  pmFormId,
  releasedDocRev,
}) => {
  useScrollIntoView();
  const classes = styles();
  const { workspaceState } = FB.useStores();
  const [docInfo, savedocInfo] = React.useState({ name: "", isQms: true });
  const [isCreateDocumentDisabled, setDisableCreateButton] = React.useState(false);

  const hasOutput = useMemo(() => {
    const documentType = documentTypesById[values.document?.documentType?.id || ""];
    return checkIsTypeHaveOutput(documentType?.groupOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentTypesById, values.document?.documentType?.id]);

  const isRecord = useMemo(() => {
    const documentType = documentTypesById[values.document?.documentType?.id || ""];
    return checkIsDocumentRecord(documentType?.groupOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentTypesById, values.document?.documentType?.id]);

  const isCurrentUserOperator = React.useContext(isOperator);
  const email = useSelector(authSelectors.currentUserEmail);
  // helpers
  const isDocRevStatusDraft = isDocumentRevisionInDraft(documentRevision?.status);
  const isDocRevStatusInPendingChange = isDocumentRevisionPendingChange(documentRevision?.status);
  const isEB = checkIsDocumentEB(documentRevision?.document.documentType.groupOptions);
  const isDocumentPOAM = checkIsDocumentPOAM(documentRevision?.document.documentType.groupOptions);
  const isDocumentDAM = checkIsDocumentDAM(documentRevision?.document.documentType.groupOptions);
  const isAlphaReleased = isDocumentAlphaReleased(documentRevision?.revisionStage);
  const isPart = checkIsDocumentPart(documentRevision?.document.documentType.groupOptions);
  const isDocumentEquipment = checkIsDocumentEquipment(documentRevision?.document.documentType.groupOptions);

  const isOwner = documentRevision?.owner ? documentRevision?.owner.user.email === email : true;
  const documentType = documentRevision?.document?.documentType?.documentTypeAcronym;
  const isDocRevFirstDraft = (isDocRevStatusDraft || isDocRevStatusInPendingChange) && documentRevision?.version === 1;
  const isSubrevision = documentRevision?.subRevision as number > 0;
  const isRevisionChangeHidden = isRecord && isDocRevStatusDraft && !isSubrevision;
  const isRevised = values.outputRevision;
  const isDisabled: boolean = initialValues.id !== undefined;
  const isDisabledInput = values.id !== undefined && isCurrentUserOperator && !isOwner;
  const docRevId = documentRevision?.id;
  const isAttachmentEmpty = !(documentRevision?.attachments.length > 1);
  const documentTypeId = values.document?.documentType?.id;
  const showOutputInfo = workspaceState?.mode === "form" || workspaceState?.mode === "formDesign";
  const shouldShowRevStageForDocType = !isDocumentPOAM && !isDocumentDAM && !isRecord;
  const outputDocumentTypes = pmFormId ?
    initialValues.outputDocumentTypes :
    initialValues.formDocument?.formTemplate?.outputDocumentTypes;

  isOwnerContext = React.createContext(isOwner);
  documentTypeContext = React.createContext(documentType);
  FormHeaderContext = React.createContext<FormHeaderContext | undefined>({
    documentRevision,
    canChangeOwnerShip,
    values,
    docInfo,
    isDisabled,
    asyncState,
    type,
  });

  useEffect(() => {
    if (!values.id && !values.document?.documentType?.id && setDocId) {
      setDocId("");
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

  useEffect(() => {
    if (isDocRevStatusDraft) {
      savedocInfo({
        name: values.name,
        isQms: values.document?.documentType?.isQms || false,
      });
    }
  }, [isDocRevStatusDraft, values.document, values.name]);

  return (
    <Grid
      item={true}
      className={classes.container}
      lg={type !== "newOutput" && isDisabled ? 12 : 7}
      sm={type !== "newOutput" && isDisabled ? 12 : 10}
      xs={12}
    >
      <UpgradeToLatestContainer
        type="banner"
        docRevId={documentRevision?.id}
        documentStatus={documentRevision?.status}
        formDocumentStatus={documentRevision?.formDocument?.status}
        bannerPortal={bannerPortal}
      />
      <FormHeader {...{ isCreateDocumentDisabled }} />
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
        <Title
          name="name"
          documentTypeId={documentTypeId}
          disabled={isDisabledInput}
        />
        <Description
          isQms={docInfo.isQms}
          documentTypeId={documentTypeId}
          isDisabled={isDisabledInput}
        />
        <DocumentTypeSelect
          outputDocumentTypes={outputDocumentTypes as unknown as FBOutputDocumentType[]}
          isDisabled={isDisabledInput}
          {...{
            type,
            isDocRevStatusDraft,
            savedocInfo,
            documentTypeId,
            setDisableCreateButton,
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
        <RevisionStage {...{ isDisabled, isDocRevFirstDraft, shouldShowRevStageForDocType, isDocumentEquipment }}/>
        <AvailableReferencesField
          availableReferences={availableReferences}
          documentReferences={documentRevision?.referenceTo}
          name="referenceTo"
          label="documentRevision.form.references"
          disabled={isDisabledInput}
          documentGroupOptions={documentRevision?.document.documentType.groupOptions}
        />
        <References document={initialValues.document} />
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
          <DocumentSecurity documentTypeId={documentTypeId as string} />
        }
        {
          workspaceState?.active && workspaceState.mode === "design" && hasOutput &&
          <FBActiveNoOutput
            docRevId={initialValues.id}
            status={documentRevision?.status}
            version={documentRevision?.version}
            isDisabled={isDisabledInput}
            outputDocs={values.outputDocumentTypes as OptionType[]}
          />
        }
        {
          workspaceState?.active &&
          <Box mt={5}>
            {
              values.id &&
              <Box textAlign="right">
                <GenerateHtmlPreview id={values.id} renderHTML={values.formDocument?.renderHTML} />
              </Box>
            }
            <div ref={FBContainer} />
          </Box>
        }
        {showOutputInfo && <DocumentRevisionOutputInfo formDocument={initialValues.formDocument} />}
      </FormWrapper>
    </Grid>
  );
};

export default (observer(DocumentRevisionFormPresenter));
