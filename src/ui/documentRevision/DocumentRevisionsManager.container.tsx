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

interface StateProps {
  currentUserEmail: string;
  loadDocumentAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
}

interface DispatchProps {
  loadDocument: typeof documentRevisionsActions.loadDocument;
}

interface OwnProps {
  documentId: string;
  documentRevisionId: string | null;
}

export type DocumentRevisionManagerContainerProps = OwnProps & DispatchProps & StateProps ;

const getDocumentRevisions = documentRevisionsSelectors.makeGetDocumentRevisions();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadDocumentAsyncState: documentRevisionsSelectors.getLoadDocumentAsyncState(state),
  documentRevisions: getDocumentRevisions(state, props.documentId),
});

export const DocumentRevisionManagerContainer: React.FunctionComponent<DocumentRevisionManagerContainerProps> = ({
  currentUserEmail, loadDocumentAsyncState, loadDocument,
  documentId, documentRevisionId, documentRevisions
}) => {
  const loadDocumentAction = () => loadDocument(documentId);

  console.log(documentRevisions);

  return (
    <div>
      <AsyncGate asyncState={loadDocumentAsyncState} asyncAction={loadDocumentAction} startActionOnMount={true}>
        <DocumentRevisionListContainer documentRevisions={documentRevisions} />
      </AsyncGate>
      <br/>
      {documentRevisionId}
    </div>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps, {
  loadDocument: documentRevisionsActions.loadDocument,
})(DocumentRevisionManagerContainer);
