import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import DocumentRevisionTable from "./DocumentRevisionTable.presenter";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";

interface StateProps {
  loadAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
  currentUserEmail: string;
}

interface DispatchProps {
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
}

type OwnProps = RouteComponentProps;

export type DocumentRevisionContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
  documentRevisions: documentRevisionsSelectors.getDocumentRevisionsList(state),
});

export const DocumentRevisionContainer: React.FunctionComponent<DocumentRevisionContainerProps> = ({
  loadDocumentRevisions,
  loadAsyncState,
  history,
  currentUserEmail,
  documentRevisions,
}) => {
  const loadAction = () => loadDocumentRevisions();
  const editDocumentRevision = (documentRevisionId: string, documentId: string) =>
    () => history.push(generateDocumentRevisionVersionPath(documentRevisionId, documentId));
  const previewDocumentRevision = (documentRevisionId: string, documentId: string) =>
    () => history.push(generateDocumentRevisionVersionPath(documentRevisionId, documentId));

  return (
    <AsyncGate asyncState={loadAsyncState} asyncAction={loadAction} startActionOnMount={true}>
      <DocumentRevisionTable
        documentRevisions={documentRevisions}
        currentUserEmail={currentUserEmail}
        editDocumentRevision={editDocumentRevision}
        previewDocumentRevision={previewDocumentRevision}
      />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps,ApplicationState>(mapStateToProps, {
  loadDocumentRevisions: documentRevisionsActions.loadList,
})(DocumentRevisionContainer);
