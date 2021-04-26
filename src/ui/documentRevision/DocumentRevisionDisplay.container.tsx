import { get } from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { connect, useSelector } from "react-redux";
import { getHasPermission } from "../../common/utils/selectors";
import { authSelectors } from "../../state/ducks/auth";
import { GroupTag, Permission } from "../../state/ducks/auth/types";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import DocumentRevisionUpdatedSubscriptions from "../document.revision/subscriptons";
import SummaryPresenter from "../document.revision/summary/presenter";
import CloneContainer from "./Clone.container";
import DocumentRevisionUpdateContainer from "./DocumentRevisionUpdate.container";
import { canChangeDocumentOwner, canEditDocumentRevision } from "./helpers/documentRevisionPermissions";

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

type DocumentRevisionDisplayContainerProps =
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

const DocumentRevisionDisplayContainer: React.FunctionComponent<DocumentRevisionDisplayContainerProps> = ({
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
  const hasChangeOwnershipPermission = useSelector(getHasPermission(Permission.DOCUMENT_OWNER_CHANGE));
  const canEditDocRev = canEditDocumentRevision(documentRevision, currentUserEmail, isCurrentUserOperator);
  isOperator = React.createContext(isCurrentUserOperator);

  const canChangeOwnerShip = useMemo(() => {
    if (!documentRevision) {
      return false;
    }

    return canChangeDocumentOwner(
      documentRevision.status,
      currentEmployeeId,
      documentRevision.owner.id,
      hasChangeOwnershipPermission,
    );
  }, [currentEmployeeId, documentRevision, hasChangeOwnershipPermission]);

  const canEdit =
    documentRevision &&
    !isNewVersion &&
    !isNewOutput &&
    canEditDocRev;

  const canPreview =
    documentRevision && !(canEdit || isNewVersion || isNewOutput);

  const subscribeToSocket = documentRevision &&
    <DocumentRevisionUpdatedSubscriptions documentRevision={documentRevision} />;

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
