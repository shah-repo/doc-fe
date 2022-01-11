import { Box, Grid } from "@material-ui/core";
import { Formik, FormikHelpers as FormikActions, FormikProps } from "formik";
import { cloneDeep, filter, isEmpty } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionForm, SMFormHOCProps } from "../../../App";
import { withSMForm } from "../../../App/Shifamed/Components/SMForm/SMForm.hoc";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag, Permission } from "../../../state/ducks/auth/types";
import { companySelectors } from "../../../state/ducks/company";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { Document, DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../../state/ducks/documents";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import { DRAWER_WIDTH } from "../../app/Navigation.styles";
import AsyncGate from "../../components/AsyncGate";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import ChangeRequestLink from "../../document.revision/summary/changeRequestLink";
import { checkIsDocumentLHR, checkIsDocumentMPIOutput } from "../../documentRevision/helpers/checkDocumentGroup";
import { FBWorkspaceMode } from "../../form.builder";
import useActionCreator from "../../hooks/useActionCreator";
import useGetAvailableReferences from "../../hooks/useGetAvailableReferences";
import useGetHasPermission from "../../hooks/useGetHasPermission";
import useShouldUpgradeToLatest from "../../hooks/useShouldUpgradeToLatest";
import Colors from "../../layout/theme/utils/colors";
import { DocumentCloneType } from "../Clone.container";
import { checkIsDocumentEditableSchema, checkIsDocumentRecord } from "../helpers/checkDocumentGroup";
import { getShouldShowUpgradeForRecord } from "../helpers/records";
import { isDocumentAlphaReleased } from "../helpers/revisionStage";
import { SIDEBAR_WIDTH } from "../Sidebar/styles";
import { DocumentRevisionFormValues } from "./types";

export interface FormHeaderContext {
  documentRevision: DocumentRevision;
  canChangeOwnerShip: boolean;
  values: DocumentRevisionFormValues;
  isDisabled: boolean;
  asyncState: AsyncState;
  type?: DocumentCloneType;
  lastSavedTimestamp?: string;
}

export let FormHeaderContext = React.createContext<FormHeaderContext | undefined>(undefined);
export let isOwnerContext = React.createContext<boolean>(false);
export let documentTypeContext = React.createContext<string | undefined>(undefined);

interface OwnProps {
  initialValues: DocumentRevisionFormValues;
  asyncState: AsyncState;
  onSubmit: (
    values: DocumentRevisionFormValues,
    actions: FormikActions<DocumentRevisionFormValues>,
    cleanInitialValues?: DocumentRevisionFormValues,
  ) => void;
  showRevisionTypeChange?: boolean;
  setDocId?: typeof documentsActions.setDocumentProposedId;
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
  documentRevision: DocumentRevision;
  proposedDocId?: string;
  loadDocumentProposedId?: typeof documentsActions.loadDocumentProposedId;
  canChangeOwnerShip?: boolean;
  type?: DocumentCloneType;
  isNewVersion?: boolean;
  pmFormId?: string;
  pmForm?: DocumentRevision;
  lastSavedTimestamp?: string;
}

type DocumentRevisionFormContainerProps = OwnProps & SMFormHOCProps;

const DocumentRevisionFormContainer: React.FunctionComponent<
DocumentRevisionFormContainerProps
> = ({
  onSubmit,
  _formState,
  initialValues,
  asyncState,
  showRevisionTypeChange,
  loadDocumentProposedId,
  proposedDocId,
  setDocId,
  doNotPrompt,
  onDirtyFlagChange,
  documentRevision,
  canChangeOwnerShip = false,
  type,
  isNewVersion,
  pmFormId,
  pmForm,
  lastSavedTimestamp,
}) => {
  const bannerPortal = React.useRef(null);
  const loadAction =  useActionCreator(documentRevisionsActions.loadList);

  const docId = initialValues.document?.docId;
  const documentType = initialValues.document?.documentType;
  const documentTypeAcronym = initialValues.document?.documentType?.documentTypeAcronym;
  const { revisionStage } = documentRevision || {};

  const loadAsyncState = useSelector(documentRevisionsSelectors.getLoadListAsyncState);

  const documentRevisions = useSelector(documentRevisionsSelectors.getDocumentRevisionsList);
  const documentTypesById = useSelector(documentTypeSelectors.byId);
  let document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, initialValues.document?.id || ""));
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);
  const redlineActive = useSelector(companySelectors.getRedlineActive);

  const availableReferences = useGetAvailableReferences(initialValues);
  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);
  const isEditableSchema = checkIsDocumentEditableSchema(document?.documentType?.groupOptions);
  const isAlphaReleased = isDocumentAlphaReleased(revisionStage);
  const isRecord = checkIsDocumentRecord(document?.documentType?.groupOptions);
  document = document || ({} as Document);

  const cleanInitialValues: DocumentRevisionFormValues = useMemo(() => {
    const renderHTML = canUpdateHTML ? initialValues.renderHTML : undefined;
    const { outputRevision } = initialValues;
    const securityGroups: any[] = [];
    if (initialValues.document?.documentType?.isQms) {
      groupOptions.forEach((group) => {
        if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
          securityGroups.push({ value: group.value, label: group.label });
        }
      });
    }

    const retrain = initialValues.id ?
      initialValues.retrain :
      initialValues.document?.documentType?.defaultTraining || false;

    const attachments = outputRevision
      ? filter(initialValues.attachments, (file) => file.lineType !== "RED_LINE")
      : initialValues.attachments;

    return {
      ...initialValues,
      attachments,
      document: {
        ...(initialValues.document || {}),
        // NOTE: workaround. DocId is set before groupOptions are loaded
        // after groupOptions have been loaded the initial values are updated and the docId is removed
        docId: proposedDocId || initialValues.document?.docId,
      },
      retrain,
      renderHTML,
      securityGroups,
      outputDocumentTypes: pmForm ?
        pmForm.formTemplate?.outputDocumentTypes as OptionType[] :
        initialValues.formTemplate?.outputDocumentTypes as OptionType[],
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUpdateHTML, initialValues, groupOptions, pmForm]);

  useEffect(() => {
    if (type !== "newVersion" && !docId && loadDocumentProposedId && documentTypeAcronym) {
      loadDocumentProposedId(documentType?.id as string);
    }
    if (setDocId && docId) {
      setDocId(docId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentTypeAcronym]);

  // FB config
  const { groupOptions: formGroupOptions } = cleanInitialValues.document?.documentType || {};
  const { docId: outputGroup } = cleanInitialValues.formDocument?.document || {};
  const isOutput =  Boolean(outputGroup && !isEmpty(outputGroup));
  const pmFormSchema = pmForm?.formTemplate?.schema || [];
  const showAdministrativeAndVoidChange = isOutput && isAlphaReleased && isRecord;
  let mode: Partial<FBWorkspaceMode> = "none";

  let { schema: originScheme = [] } = (
    (cleanInitialValues)?.formTemplate ||
    (cleanInitialValues)?.formDocument?.formTemplate ||
    {}
  );
  originScheme = pmForm ? pmFormSchema : cleanInitialValues?.schema || originScheme;
  const formInput = useMemo(() =>
    cleanInitialValues ? cloneDeep(cleanInitialValues.formInput) : {}
  , [cleanInitialValues]);

  if (formGroupOptions && formGroupOptions.includes("FORM")) {
    mode = "design";
  } else if (outputGroup || !isEmpty(originScheme)) {
    mode = isEditableSchema ? "formDesign" : "form";
  } else if (pmForm) {
    mode = "form";
  }
  _formState?.setMode(mode);
  const email = useSelector(authSelectors.currentUserEmail);
  const isOwner = documentRevision?.owner ? documentRevision?.owner.user.email === email : true;
  const isDisabled: boolean = initialValues.id !== undefined;

  isOwnerContext = React.createContext(isOwner);
  documentTypeContext = React.createContext(documentTypeAcronym);
  FormHeaderContext = React.createContext<FormHeaderContext | undefined>({
    documentRevision,
    canChangeOwnerShip,
    values: initialValues,
    isDisabled,
    asyncState,
    type,
    lastSavedTimestamp,
  });

  const groupOptions1 = documentRevision?.document.documentType.groupOptions;
  const isMPIOutput = checkIsDocumentMPIOutput(groupOptions1);
  const isLHR = checkIsDocumentLHR(groupOptions1);
  const shouldShowUpgradeForDocs = useShouldUpgradeToLatest(
    documentRevision?.status,
    documentRevision?.formDocument?.status,
    documentRevision?.formDocument?.document?.id
  );
  const shouldShowUpgradeBannerForRecord = getShouldShowUpgradeForRecord(documentRevision);

  const shouldShowUpgrade =
    ((!isRecord && shouldShowUpgradeForDocs) || (shouldShowUpgradeBannerForRecord && shouldShowUpgradeForDocs))
    && !isMPIOutput && !isLHR;

  const render = (props: FormikProps<DocumentRevisionFormValues>) => (
    <DocumentRevisionForm
      formValues={props}
      schema={originScheme}
      {...{
        documentRevision,
        shouldShowUpgrade,
        bannerPortal,
        type,
        isDisabled,
        documentRevisions,
        availableReferences,
        showRevisionTypeChange,
        proposedDocId,
        setDocId,
        doNotPrompt,
        onDirtyFlagChange,
        documentTypesById,
        canChangeOwnerShip,
        isNewVersion,
        showAdministrativeAndVoidChange,
        pmFormId,
        document,
        redlineActive,
        isOutput,
        lastSavedTimestamp,
        email,
        isOwner,
        autosaveEnabled,
        formInput,
      }}
    />
  );

  return (
    <AsyncGate
      asyncState={loadAsyncState}
      asyncAction={loadAction}
      startActionOnMount={true}
    >
      <div ref={bannerPortal}
        style={{ position: "fixed", width: `calc(100% - ${DRAWER_WIDTH + SIDEBAR_WIDTH}px)`, zIndex: 1001 }}
      />
      <Grid style={{ background: Colors.light_gray }} >
        {
          type !== "newOutput" &&
          <Box ml={3}>
            <ChangeRequestLink dataProp={documentRevision} />
          </Box>
        }
        <Formik
          initialValues={cleanInitialValues}
          onSubmit={(values, helpers) => onSubmit(values, helpers, cleanInitialValues) }
          enableReinitialize={true}
        >
          {render}
        </Formik>
      </Grid>
    </AsyncGate>
  );
};

export default withSMForm(DocumentRevisionFormContainer);

