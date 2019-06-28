import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import { documentRevisionsActions, documentRevisionsSelectors, DocumentRevision } from "../../state/ducks/documentRevisions";
import AsyncGate from "../components/AsyncGate";
import { AsyncState } from "../../state/types";
import DocumentRevisionPreviewPresenter from "./DocumentRevisionPreview.presenter";
import { canEditDocumentRevision } from "./helpers";
import DocumentRevisionUpdateContainer from "./DocumentRevisionUpdate.container";
import CloneContainer from "./Clone.container";

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
  documentRevisionId, documentRevision, loadDocumentRevisionAsyncState, ...props
}) => {
  const loadDocumentRevisionAction = () => loadDocumentRevision(documentRevisionId);
  const canEdit = documentRevision && !isNewVersion && canEditDocumentRevision(documentRevision, currentUserEmail);
  const canPreview = documentRevision && !canEdit && !isNewVersion;

  return (
    <AsyncGate asyncState={loadDocumentRevisionAsyncState} asyncAction={loadDocumentRevisionAction} startActionOnMount={true}>
      {canEdit && <DocumentRevisionUpdateContainer documentRevision={documentRevision} />}
      {canPreview && <DocumentRevisionPreviewPresenter documentRevision={documentRevision} />}
      {isNewVersion && <CloneContainer documentRevision={documentRevision} />}
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadDocumentRevision: documentRevisionsActions.load,
})(DocumentRevisionDisplayContainer);
