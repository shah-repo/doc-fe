import { Grid } from "@material-ui/core";
import { Formik, FormikHelpers as FormikActions, FormikProps } from "formik";
import { cloneDeep, filter, isEmpty } from "lodash";
import { useObserver } from "mobx-react";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionForm, SMFormHOCProps } from "../../../App";
import { withSMForm } from "../../../App/Shifamed/Components/SMForm/SMForm.hoc";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag, Permission } from "../../../state/ducks/auth/types";
import { Approval } from "../../../state/ducks/common/types";
import { companySelectors } from "../../../state/ducks/company";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { Document, DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../../state/ducks/documents";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { FBWorkspaceMode } from "../../form.builder";
import FBDataStore from "../../form.builder/FBStore/FBDataStore";
import useDidMount from "../../hooks/useDidMount";
import useGetHasPermission from "../../hooks/useGetHasPermission";
import useShouldUpgradeToLatest from "../../hooks/useShouldUpgradeToLatest";
import Colors from "../../layout/theme/utils/colors";
import { DocumentCloneType } from "../Clone.container";
import { checkIsDocumentDAM, checkIsDocumentEditableSchema, checkIsDocumentLHR, checkIsDocumentMPIOutput, checkIsDocumentPO, checkIsDocumentRecord } from "../helpers/checkDocumentGroup";
import { isFormWithInlineApproval } from "../helpers/records";
import { isDocumentAlphaReleased } from "../helpers/revisionStage";
import { DocumentRevisionFormValues, FBDataStoreApprovalKeys } from "./types";

export interface FormHeaderContext {
  documentRevision: DocumentRevision;
  canChangeOwnerShip: boolean;
  values: DocumentRevisionFormValues;
  isDisabled: boolean;
  mode: FBWorkspaceMode;
  asyncState: AsyncState;
  type?: DocumentCloneType;
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
}) => {
  const didMount = useDidMount();
  const bannerPortal = React.useRef(null);
  const docId = initialValues.document?.docId;
  const documentType = initialValues.document?.documentType;
  const documentTypeAcronym = initialValues.document?.documentType?.documentTypeAcronym;
  const { revisionStage } = documentRevision || {};
  const documentRevisions = useSelector(documentRevisionsSelectors.getDocumentRevisionsList);
  const documentTypesById = useSelector(documentTypeSelectors.byId);
  let document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, initialValues.document?.id || ""));
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);
  const redlineActive = useSelector(companySelectors.getRedlineActive);

  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);
  const isEditableSchema = checkIsDocumentEditableSchema(initialValues.document?.documentType?.groupOptions);
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
      outputDocumentTypes: initialValues.formTemplate?.outputDocumentTypes as OptionType[],
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUpdateHTML, initialValues, groupOptions, FBDataStore?.refreshData]);

  useObserver(() => {
    cleanInitialValues.formInput = FBDataStore?.refreshData?.formInput ?? cleanInitialValues.formInput;
    if (didMount) {

      if (documentRevision?.updatedAt && FBDataStore?.refreshData?.updatedAt) {
        documentRevision.updatedAt = FBDataStore?.refreshData?.updatedAt;
      }

      if (checkIsDocumentPO(documentRevision?.document?.documentType?.groupOptions)) {
        documentRevision.approvals = FBDataStore.poApprovals as Approval[];
      }

      if (isFormWithInlineApproval(documentRevision?.formDocument?.formTemplate?.schema)) {
        documentRevision.approvals = FBDataStore.inlineApprovals as Approval[];
      }
    }
  });

  useEffect(() => {
    if (checkIsDocumentPO(documentRevision?.document?.documentType?.groupOptions)) {
      FBDataStore.setApprovals(documentRevision.approvals, FBDataStoreApprovalKeys.PO_APPROVALS);
    }

    if (isFormWithInlineApproval(documentRevision?.formDocument?.formTemplate?.schema)) {
      FBDataStore.setApprovals(documentRevision.approvals, FBDataStoreApprovalKeys.INLINE_APPROVALS);
    }

    return () => {
      FBDataStore.setRefreshData(undefined);
      FBDataStore.clearPoApprovals();
      FBDataStore.clearInlineApprovals();
    };
  }, []);

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
  const showAdministrativeAndVoidChange = isOutput && isAlphaReleased && isRecord;
  let mode: Partial<FBWorkspaceMode> = "none";

  let { schema: originScheme = [] } = (
    (cleanInitialValues)?.formTemplate ||
    (cleanInitialValues)?.formDocument?.formTemplate ||
    {}
  );
  originScheme = cleanInitialValues?.schema || originScheme;
  const formInput = useMemo(() =>
    cleanInitialValues ? cloneDeep(cleanInitialValues.formInput) : {}
  , [cleanInitialValues]);

  if (formGroupOptions && formGroupOptions.includes("FORM")) {
    mode = "design";
  } else if (outputGroup || !isEmpty(originScheme)) {
    mode = isEditableSchema ? "formDesign" : "form";
  }
  useEffect(() => {
    _formState?.setMode(mode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

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
    mode,
  });

  const groupOptions1 = documentRevision?.document.documentType.groupOptions;
  const isMPIOutput = checkIsDocumentMPIOutput(groupOptions1);
  const isLHR = checkIsDocumentLHR(groupOptions1);
  const shouldShowUpgradeForDocs = useShouldUpgradeToLatest(
    documentRevision?.status,
    documentRevision?.formDocument?.status,
    documentRevision?.formDocument?.document?.id
  );

  const shouldShowUpgrade =
    ((!isRecord && shouldShowUpgradeForDocs) || ( shouldShowUpgradeForDocs))
    && !isMPIOutput && !isLHR;
  const isDAM = checkIsDocumentDAM(formGroupOptions);

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
        showRevisionTypeChange,
        proposedDocId,
        setDocId,
        doNotPrompt,
        onDirtyFlagChange,
        documentTypesById,
        canChangeOwnerShip,
        isNewVersion,
        showAdministrativeAndVoidChange,
        document,
        redlineActive,
        isOutput,
        email,
        isOwner,
        autosaveEnabled,
        formInput,
        mode,
        isDAM,
      }}
    />
  );

  return (
    <>
      <Grid ref={bannerPortal} />
      {/* TODO Get rid of inline styles */}
      <Grid style={{ background: Colors.alabaster, height: "100%" }} >
        <Formik
          initialValues={cleanInitialValues}
          onSubmit={(values, helpers) => onSubmit(values, helpers, cleanInitialValues) }
          enableReinitialize={true}
        >
          {render}
        </Formik>
      </Grid>
    </>
  );
};

export default withSMForm(DocumentRevisionFormContainer);
