import { get } from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { approvalsActions } from "../../state/ducks/approvals";
import { authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import HelloSignAllSignedRefreshSockets from "../document.revision/HelloSignAllSignedRefreshSockets";
import SummaryPresenter from "../document.revision/summary/presenter";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import CloneContainer from "./Clone.container";
import DocumentRevisionUpdateContainer from "./DocumentRevisionUpdate.container";
import { canChangeDocumentOwner, canEditDocumentRevision } from "./helpers";

interface StateProps {
  currentUserEmail: string;
  loadDocumentRevisionAsyncState: AsyncState;
  documentRevision: DocumentRevision;
  currentEmployeeId: string;
  isCompanyAdmin: boolean;
  selectedDocument: DocumentRevision;
}

interface DispatchProps {
  loadDocumentRevision: typeof documentRevisionsActions.load;
}

interface OwnProps {
  documentId: string;
  documentRevisionId: string;
  isNewVersion?: boolean;
  isNewOutput?: boolean;
}

export let isOperator = React.createContext<boolean>(false);

export type DocumentRevisionDisplayContainerProps =
  OwnProps &
  DispatchProps &
  StateProps;

const selectCanChangeOwnership = authSelectors.makeGetHasTag();
const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadDocumentRevisionAsyncState: documentRevisionsSelectors.getLoadAsyncState(state),
  isCompanyAdmin: selectCanChangeOwnership(state, GroupTag.USER_MANAGEMENT),
  currentEmployeeId: authSelectors.currentEmployeeId(state),
  documentRevision: documentRevisionsSelectors.getDocumentRevision(
    state,
    props.documentRevisionId,
  ),
  selectedDocument: documentRevisionsSelectors.getDocumentRevision(
    state,
    props.documentRevisionId
  ),
});

export const DocumentRevisionDisplayContainer: React.FunctionComponent<DocumentRevisionDisplayContainerProps> = ({
  currentUserEmail,
  loadDocumentRevision,
  isNewVersion,
  isNewOutput,
  documentRevisionId,
  documentRevision,
  loadDocumentRevisionAsyncState,
  documentId,
  currentEmployeeId,
  isCompanyAdmin,
  selectedDocument,
}) => {
  const loadDocumentRevisionAction = useCallback(() => {
    if (documentRevisionId) {
      loadDocumentRevision(documentRevisionId);
    }
  }, [documentRevisionId, loadDocumentRevision]);

  useEffect(() => {
    loadDocumentRevisionAction();
  }, [loadDocumentRevisionAction]);

  const operators = get(selectedDocument, "document.operators", []);
  const availableOperators = operators.map((operator) => operator.user.email);
  const isCurrentUserOperator = availableOperators.includes(currentUserEmail);

  isOperator = React.createContext(isCurrentUserOperator);

  const async = useAsync();
  const applyTransition = useActionCreator(approvalsActions.applyTransition);

  const changeApprovalStatus = (transition: "approve" | "reject") => {
    const approvalId = documentRevision?.approvals?.find((app) => app.approver.id === currentEmployeeId)?.id;
    async.start(
      applyTransition,
      approvalId,
      transition,
      async,
    );
  };

  const canChangeOwnerShip = useMemo(() => {
    if (!documentRevision) {
      return false;
    }
    return canChangeDocumentOwner(
      documentRevision.status,
      currentEmployeeId,
      documentRevision.owner.id,
      isCompanyAdmin,
    );
  }, [currentEmployeeId, documentRevision, isCompanyAdmin]);

  const canEdit =
    documentRevision &&
    !isNewVersion &&
    !isNewOutput &&
    (canEditDocumentRevision(documentRevision, currentUserEmail) || isCurrentUserOperator);

  const canPreview =
    documentRevision && !(canEdit || isNewVersion || isNewOutput);

  const subscribeToSocket = documentRevision &&
    <HelloSignAllSignedRefreshSockets documentRevision={documentRevision} />;

  return (
    <AsyncGate
      asyncState={loadDocumentRevisionAsyncState}
      asyncAction={loadDocumentRevisionAction}
      startActionOnMount={false}
    >
      {subscribeToSocket}
      {canEdit && (
        <DocumentRevisionUpdateContainer
          documentRevision={documentRevision}
          documentId={documentId}
          canChangeOwnerShip={canChangeOwnerShip}
          isNewVersion={isNewVersion as boolean}
        />
      )}
      {canPreview && (
        <SummaryPresenter
          dataProp={documentRevision}
          canChangeOwnerShip={canChangeOwnerShip}
          canShowCreateVersionButton={true}
          changeApprovalStatus={changeApprovalStatus}
        />
      )}
      {isNewVersion && (
        <CloneContainer documentRevision={documentRevision} type="newVersion" isNewVersion={isNewVersion} />
      )}
      {isNewOutput && (
        <CloneContainer documentRevision={documentRevision} type="newOutput" isNewVersion={isNewVersion as boolean} />
      )}
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadDocumentRevision: documentRevisionsActions.load,
  },
)(DocumentRevisionDisplayContainer);
