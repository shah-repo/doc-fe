import { Grid, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import { documentVersionPath } from "../document.revision/utils/paths";
import DocumentRevisionAuditContainer from "./audit/Audit.container";
import DocumentRevisionDisplayContainer from "./DocumentRevisionDisplay.container";
import DocumentRevisionListContainer from "./DocumentRevisionList.container";
import { getDocRevIdToRedirect, shouldRedircetToLatestReleasd } from "./helpers";
import styles from "./styles";

interface StateProps {
  loadDocumentAsyncState: AsyncState;
  documentRevisions: DocumentRevision[];
  docId: string;
}

interface DispatchProps {
  loadDocument: typeof documentRevisionsActions.loadDocument;
}

interface OwnProps {
  documentId: string;
  documentRevisionId: string | null;
  isNewVersion: boolean;
  deprecatedAt: string;
}

export type DocumentRevisionManagerContainerProps = OwnProps &
  DispatchProps &
  StateProps &
  WithStyles<typeof styles>;

const getDocumentRevisions = documentRevisionsSelectors.makeGetDocumentRevisions();
const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  loadDocumentAsyncState: documentRevisionsSelectors.getLoadDocumentAsyncState(
    state,
  ),
  documentRevisions: getDocumentRevisions(state, props.documentId),
  docId: documentRevisionsSelectors.getDocId(state, props.documentId),
});

export const DocumentRevisionManagerContainer: React.FunctionComponent<
  DocumentRevisionManagerContainerProps
> = ({
  classes,
  loadDocumentAsyncState,
  loadDocument,
  isNewVersion,
  documentId,
  documentRevisionId,
  documentRevisions,
  deprecatedAt,
  docId,
}) => {
  const loadDocumentAction = () => loadDocument(documentId);

  if (shouldRedircetToLatestReleasd(documentRevisions, documentRevisionId)) {
    const docRevIdToRedirect = getDocRevIdToRedirect(documentRevisions, deprecatedAt);
    return (
      <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />
    );
  }

  return (
    <Grid container={true} spacing={2} className={classes.whiteContainer}>
      <Grid item={true} xs={2} className={classes.sidebar}>
        <AsyncGate
          asyncState={loadDocumentAsyncState}
          asyncAction={loadDocumentAction}
          startActionOnMount={true}
        >
          <DocumentRevisionListContainer
            documentRevisions={documentRevisions}
            documentId={documentId}
            docId={docId}
          />
        </AsyncGate>
      </Grid>
      <Grid item={true} xs={7}>
        {documentRevisionId && (
          <DocumentRevisionDisplayContainer
            documentRevisionId={documentRevisionId}
            isNewVersion={isNewVersion}
          />
        )}
      </Grid>
      <Grid item={true} xs={3} className={classes.sidebar}>
        {documentRevisionId && (
          <DocumentRevisionAuditContainer
            documentRevisionId={documentRevisionId}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadDocument: documentRevisionsActions.loadDocument,
  },
)(withStyles(styles)(DocumentRevisionManagerContainer));
