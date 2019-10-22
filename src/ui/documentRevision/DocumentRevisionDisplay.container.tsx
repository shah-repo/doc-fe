import React, { useEffect } from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import SummaryPresenter from "../document.revision/summary/presenter";
import CloneContainer from "./Clone.container";
import DocumentRevisionUpdateContainer from "./DocumentRevisionUpdate.container";
import { canEditDocumentRevision } from "./helpers";

interface StateProps {
  currentUserEmail: string;
  loadDocumentRevisionAsyncState: AsyncState;
  documentRevision: DocumentRevision;
}

interface DispatchProps {
  loadDocumentRevision: typeof documentRevisionsActions.load;
}

interface OwnProps {
  documentRevisionId: string;
  isNewVersion: boolean;
}

export type DocumentRevisionDisplayContainerProps = OwnProps & DispatchProps & StateProps ;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadDocumentRevisionAsyncState: documentRevisionsSelectors.getLoadAsyncState(state),
  documentRevision: documentRevisionsSelectors.getDocumentRevision(state, props.documentRevisionId),
});

export const DocumentRevisionDisplayContainer: React.FunctionComponent<DocumentRevisionDisplayContainerProps> = ({
  currentUserEmail, loadDocumentRevision, isNewVersion,
  documentRevisionId, documentRevision, loadDocumentRevisionAsyncState,
}) => {
  const loadDocumentRevisionAction = () => loadDocumentRevision(documentRevisionId);

  useEffect(() => {
    if (documentRevisionId) {
      loadDocumentRevisionAction();
    }
  }, [documentRevisionId]);
  const canEdit = documentRevision && !isNewVersion && canEditDocumentRevision(documentRevision, currentUserEmail);
  const canPreview = documentRevision && !(canEdit || isNewVersion);

  return (
    <AsyncGate
      asyncState={loadDocumentRevisionAsyncState}
      asyncAction={loadDocumentRevisionAction}
      startActionOnMount={false}
    >
      {canEdit && <DocumentRevisionUpdateContainer documentRevision={documentRevision} />}
      {canPreview && <SummaryPresenter dataProp={documentRevision} canShowCreateVersionButton={true} />}
      {isNewVersion && <CloneContainer documentRevision={documentRevision} />}
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadDocumentRevision: documentRevisionsActions.load,
})(DocumentRevisionDisplayContainer);
