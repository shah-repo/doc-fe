import { Grid } from "@material-ui/core";
import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { DocumentRevision, documentRevisionsActions, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import DocumentRevisionDisplayContainer from "./DocumentRevisionDisplay.container";
import DocumentRevisionListContainer from "./DocumentRevisionList.container";
import { documentVersionPath } from "../document.revision/utils/paths";

interface StateProps {
  loadDocumentAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
}

interface DispatchProps {
  loadDocument: typeof documentRevisionsActions.loadDocument;
}

interface OwnProps {
  documentId: string;
  documentRevisionId: string | null;
  isNewVersion: boolean;
}

export type DocumentRevisionManagerContainerProps = OwnProps & DispatchProps & StateProps ;

const getDocumentRevisions = documentRevisionsSelectors.makeGetDocumentRevisions();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadDocumentAsyncState: documentRevisionsSelectors.getLoadDocumentAsyncState(state),
  documentRevisions: getDocumentRevisions(state, props.documentId),
});

export const DocumentRevisionManagerContainer: React.FunctionComponent<DocumentRevisionManagerContainerProps> = ({
  loadDocumentAsyncState, loadDocument, isNewVersion,
  documentId, documentRevisionId, documentRevisions,
}) => {
  const loadDocumentAction = () => loadDocument(documentId);

  if (documentRevisions.length > 0 && !documentRevisionId) {
    const docRevIdToRedirect = documentRevisions[documentRevisions.length - 1].id;
    // redirect to latest version
    return <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />;
  }

  return (
    <Grid container={true} spacing={10}>
      <Grid item={true} xs={3}>
        <AsyncGate asyncState={loadDocumentAsyncState} asyncAction={loadDocumentAction} startActionOnMount={true}>
          <DocumentRevisionListContainer documentRevisions={documentRevisions} documentId={documentId} />
        </AsyncGate>
      </Grid>
      <Grid item={true} xs={6}>
        {documentRevisionId && <DocumentRevisionDisplayContainer documentRevisionId={documentRevisionId} isNewVersion={isNewVersion} />}
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadDocument: documentRevisionsActions.loadDocument,
})(DocumentRevisionManagerContainer);
