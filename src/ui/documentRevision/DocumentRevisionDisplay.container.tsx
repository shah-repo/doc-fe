import React from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import DocumentRevisionForm from "./forms/DocumentRevisionForm.container";
import { documentRevisionsActions, documentRevisionsSelectors, DocumentRevision } from "../../state/ducks/documentRevisions";
import AsyncGate from "../components/AsyncGate";
import DocumentRevisionListContainer from "./DocumentRevisionList.container";
import { AsyncState } from "../../state/types";
import DocumentRevisionPreviewPresenter from "./DocumentRevisionPreview.presenter";
import { canEditDocumentRevision, canSubmitDocumentRevision } from "./helpers";
import DocumentRevisionUpdateContainer from "./DocumentRevisionUpdate.container";

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
}

export type DocumentRevisionDisplayContainerProps = OwnProps & DispatchProps & StateProps ;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadDocumentRevisionAsyncState: documentRevisionsSelectors.getLoadAsyncState(state),
  documentRevision: documentRevisionsSelectors.getDocumentRevision(state, props.documentRevisionId),
});

export const DocumentRevisionDisplayContainer: React.FunctionComponent<DocumentRevisionDisplayContainerProps> = ({
  currentUserEmail, loadDocumentRevision,
  documentRevisionId, documentRevision, loadDocumentRevisionAsyncState,
}) => {
  const loadDocumentRevisionAction = () => loadDocumentRevision(documentRevisionId);
  const canEdit = documentRevision && canEditDocumentRevision(documentRevision, currentUserEmail);
  const canSubmit = documentRevision && canSubmitDocumentRevision(documentRevision, currentUserEmail);

  return (
    <AsyncGate asyncState={loadDocumentRevisionAsyncState} asyncAction={loadDocumentRevisionAction} startActionOnMount={true}>
      {canEdit && <DocumentRevisionUpdateContainer documentRevision={documentRevision} />}
      {!canEdit && <DocumentRevisionPreviewPresenter documentRevision={documentRevision} canSubmitDocument={canSubmit} />}
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadDocumentRevision: documentRevisionsActions.load,
})(DocumentRevisionDisplayContainer);
