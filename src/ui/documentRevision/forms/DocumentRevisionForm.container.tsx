import { Box, Grid } from "@material-ui/core";
import classNames from "classnames";
import { Formik, FormikHelpers as FormikActions, FormikProps } from "formik";
import { get } from "lodash";
import React, { useEffect, useMemo } from "react";
import { connect, useSelector } from "react-redux";
import { GroupTag, Permission } from "../../../state/ducks/auth/types";
import { Document, DocumentRevision, documentRevisionsActions, documentRevisionsSelectors, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { DocumentType, DocumentTypeByIdState, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../state/ducks/documents";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import ChangeRequestLink from "../../document.revision/summary/changeRequestLink";
import DocumentHeader from "../../document.revision/summary/header";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useGetHasPermission from "../../hooks/useGetHasPermission";
import styles from "./DocumentRevisionForm.container.style";
import DocumentRevisionFormPresenter from "./DocumentRevisionForm.presenter";
import { DocumentRevisionFormValues } from "./types";

interface StateProps {
  availableReferences: OptionType[];
  loadAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
  documentTypes: DocumentType[];
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
  ) => void;
  showRevisionTypeChange?: boolean;
  setDocId?: typeof documentsActions.setDocumentProposedId;
  doNotPrompt?: boolean;
  onDirtyFlagChange?: (dirty: boolean) => void;
  documentRevision: DocumentRevision;
  proposedDocId?: string;
  loadDocumentProposedId?: typeof documentsActions.loadDocumentProposedId;
  canChangeOwnerShip?: boolean;
  type?: string;
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
  documentTypes: documentTypeSelectors.getDocumentTypeFormOptions(state),
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
  documentTypes,
  documentTypesById,
  document,
  canChangeOwnerShip = false,
  type,
}) => {

  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  const cleanInitialValues = useMemo(() => {
    const renderHTML = canUpdateHTML ? initialValues.renderHTML : undefined;
    const securityGroups: any[] = [];
    if (initialValues.document?.documentType?.isQms) {
      groupOptions.forEach((group) => {
        if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
          securityGroups.push({ value: group.value, label: group.label });
        }
      });
    }

    return {
      ...initialValues,
      renderHTML,
      securityGroups,
    };
  }, [canUpdateHTML, initialValues, groupOptions]);

  const docTypes = useMemo(
    () =>
      documentTypes.map((document) => ({
        value: document.id,
        text: document.documentTypeName,
      })),
    [documentTypes],
  );

  const outputDocumentTypeOptions: OptionType[] = useMemo(
    () =>
      documentTypes.reduce((acc: OptionType[], document) => {
        if (document.group === "RECORD" || document.group === "OTHER") {
          acc.push({ value: document.id, label: document.documentTypeName });
        }
        return acc;
      }, []),
    [documentTypes],
  );

  const upgradeAction = useActionCreator(documentRevisionsActions.upgradeToReleasedForm);
  const async = useAsync();

  const onUpgradeClick = () => {
    async.start(upgradeAction, documentRevision.id, async);
  };

  useEffect(() => {
    if (type !== "newVersion" &&
      !initialValues.document?.docId &&
      loadDocumentProposedId &&
      initialValues.document?.documentType?.documentTypeAcronym) {
      loadDocumentProposedId(initialValues.document?.documentType.id as string);
    }
    if (setDocId && initialValues.document?.docId) {
      setDocId(initialValues.document?.docId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues.document?.documentType?.documentTypeAcronym]);

  document = document || ({} as Document);
  const classes = styles();

  const render = (props: FormikProps<DocumentRevisionFormValues>) => (
    <DocumentRevisionFormPresenter
      {...props}
      asyncState={asyncState}
      documentRevisions={documentRevisions}
      documentRevision={documentRevision}
      availableReferences={availableReferences}
      showRevisionTypeChange={showRevisionTypeChange}
      loadDocumentProposedId={loadDocumentProposedId}
      proposedDocId={proposedDocId}
      setDocId={setDocId}
      doNotPrompt={doNotPrompt}
      onDirtyFlagChange={onDirtyFlagChange}
      documentTypes={docTypes}
      outputDocumentTypeOptions={outputDocumentTypeOptions}
      documentTypesById={documentTypesById}
      canChangeOwnerShip={canChangeOwnerShip}
      onUpgradeClick={onUpgradeClick}
      type={type}
    />
  );

  // TODO: check why are we loading all document revisions
  // if it's really necessary maybe it can be loaded through the DataFetcherContainer
  // it will be loaded only once instead every time this component is mounted
  const loadAction = () =>
    loadDocumentRevisions([
      DocumentRevisionStatus.Released,
      DocumentRevisionStatus.Deprecated,
      DocumentRevisionStatus.Obsolete,
      DocumentRevisionStatus.PendingChange,
      DocumentRevisionStatus.Draft,
    ]);

  return (
    <AsyncGate
      asyncState={loadAsyncState}
      asyncAction={loadAction}
      startActionOnMount={true}
    >
      {documentRevision && <DocumentHeader dataProp={documentRevision} />}
      <Grid
        className={classNames(classes.container, {
          [classes.borderContainer]: documentRevision,
        })}
      >
        <Box ml={3}>
          <ChangeRequestLink dataProp={documentRevision} />
        </Box>
        <Formik
          initialValues={cleanInitialValues}
          onSubmit={onSubmit}
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
