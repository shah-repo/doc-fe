import { Box, Grid } from "@material-ui/core";
import { Formik, FormikHelpers as FormikActions, FormikProps } from "formik";
import { cloneDeep, filter, get, isEmpty } from "lodash";
import React, { useEffect, useMemo } from "react";
import { connect, useSelector } from "react-redux";
import { GroupTag, Permission } from "../../../state/ducks/auth/types";
import { Document, DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { DocumentTypeByIdState, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import ChangeRequestLink from "../../document.revision/summary/changeRequestLink";
import { FBWorkspace, FBWorkspaceMode } from "../../form.builder";
import useGetHasPermission from "../../hooks/useGetHasPermission";
import Colors from "../../layout/theme/utils/colors";
import { DocumentCloneType } from "../Clone.container";
import { getIsDocumentRecord } from "../helpers";
import DocumentRevisionFormPresenter from "./DocumentRevisionForm.presenter";
import { DocumentRevisionFormValues } from "./types";

interface StateProps {
  availableReferences: OptionType[];
  loadAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
  documentTypesById: DocumentTypeByIdState;
  document: Document;
}

interface DispatchProps {
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
}

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
}

export type DocumentRevisionFormContainerProps = OwnProps &
StateProps &
DispatchProps;

const getAvailableReferences = documentRevisionsSelectors.makeGetAvailableReferences();
const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  availableReferences: getAvailableReferences(state, props.initialValues),
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
  documentRevisions: documentRevisionsSelectors.getDocumentRevisionsList(state),
  documentTypesById: documentTypeSelectors.byId(state),
  document: documentRevisionsSelectors.getDocument(
    state,
    get(props.initialValues, "document.id"),
  ),
});

export const DocumentRevisionFormContainer: React.FunctionComponent<
DocumentRevisionFormContainerProps
> = ({
  onSubmit,
  initialValues,
  asyncState,
  documentRevisions,
  availableReferences,
  showRevisionTypeChange,
  loadDocumentRevisions,
  loadAsyncState,
  loadDocumentProposedId,
  proposedDocId,
  setDocId,
  doNotPrompt,
  onDirtyFlagChange,
  documentRevision,
  documentTypesById,
  document,
  canChangeOwnerShip = false,
  type,
  isNewVersion,
  pmFormId,
}) => {

  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const bannerPortal = React.useRef(null);
  const { revisionStage } = documentRevision || {};
  const isAlphaReleased = revisionStage === 3;
  const isRecord = getIsDocumentRecord(document?.documentType?.groupOptions);
  const pmForm = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, pmFormId || ""),
  );

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
    if (type !== "newVersion" &&
      !initialValues.document?.docId &&
      loadDocumentProposedId &&
      initialValues.document?.documentType?.documentTypeAcronym)
    {
      loadDocumentProposedId(initialValues.document?.documentType.id as string);
    }
    if (setDocId && initialValues.document?.docId)
    {
      setDocId(initialValues.document?.docId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues.document?.documentType?.documentTypeAcronym]);

  document = document || ({} as Document);

  // FB config
  const FBContainer = React.useRef(null);
  const { group: formGroup } = cleanInitialValues.document?.documentType || {};
  const { docId: outputGroup } = cleanInitialValues.formDocument?.document || {};
  let { schema: originScheme = [] } = (
    (cleanInitialValues)?.formTemplate ||
    (cleanInitialValues)?.formDocument?.formTemplate ||
    {}
  );
  originScheme = cleanInitialValues?.schema || originScheme;
  const isOutput =  Boolean(outputGroup && !isEmpty(outputGroup));
  const formInput = useMemo(() =>
    cleanInitialValues ? cloneDeep(cleanInitialValues.formInput) : {}
  , [cleanInitialValues]);

  let mode: Partial<FBWorkspaceMode> = "none";
  if (formGroup && formGroup.includes("FORM")) {
    mode = "design";
  } else if (outputGroup) {
    mode = (formGroup === "ENGINEERING_BUILD") ? "formDesign" : "form";
  }
  const showAdministrativeAndVoidChange = isOutput && isAlphaReleased && isRecord;

  const render = (props: FormikProps<DocumentRevisionFormValues>) => (
    <FBWorkspace
      portalContainer={FBContainer}
      document={{
        ...props.values as unknown as DocumentRevision,
        ...documentRevision as unknown as DocumentRevision,
      }}
      initialValues={formInput}
      autosave={true}
      schema={originScheme}
      {...{ mode }}
    >
      <DocumentRevisionFormPresenter
        {...props}
        {...{
          asyncState,
          documentRevisions,
          documentRevision,
          availableReferences,
          showRevisionTypeChange,
          proposedDocId,
          setDocId,
          doNotPrompt,
          onDirtyFlagChange,
          documentTypesById,
          canChangeOwnerShip,
          type,
          isNewVersion,
          FBContainer,
          bannerPortal,
          showAdministrativeAndVoidChange,
          pmFormId,
        }}
      />
    </FBWorkspace>
  );
  // TODO: check why are we loading all document revisions
  // if it's really necessary maybe it can be loaded through the DataFetcherContainer
  // it will be loaded only once instead every time this component is mounted
  const loadAction = () =>
    loadDocumentRevisions();

  return (
    <AsyncGate
      asyncState={loadAsyncState}
      asyncAction={loadAction}
      startActionOnMount={true}
    >
      <div ref={bannerPortal} />
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

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadDocumentRevisions: documentRevisionsActions.loadList,
  },
)(DocumentRevisionFormContainer);
