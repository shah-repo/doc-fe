import { Grid, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment-timezone";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import DocumentRevisionDisplayContainer from "./DocumentRevisionDisplay.container";
import DocumentRevisionListContainer from "./DocumentRevisionList.container";
import { documentVersionPath } from "../document.revision/utils/paths";
import DocumentRevisionAuditContainer from "./audit/Audit.container";
import styles from "./styles";

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
}) => {
  const loadDocumentAction = () => loadDocument(documentId);

  if (documentRevisions.length > 0 && !documentRevisionId) {
    let indexOfDocRev = documentRevisions.length - 1;
    if (deprecatedAt) {
      const depreactedAtDate = moment(deprecatedAt);
      let indexOfLastReleased = _.findLastIndex(documentRevisions, (doc) => {
        if (!doc.releasedAt) return false;

        return moment(doc.releasedAt).isSameOrBefore(depreactedAtDate);
      });
      indexOfDocRev =
        indexOfLastReleased > -1 ? indexOfLastReleased : indexOfDocRev;
    }

    const docRevIdToRedirect = documentRevisions[indexOfDocRev].id;
    return (
      <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />
    );
  }

  return (
    <Grid container={true} spacing={10} className={classes.whiteContainer}>
      <Grid item={true} xs={3}>
        <AsyncGate
          asyncState={loadDocumentAsyncState}
          asyncAction={loadDocumentAction}
          startActionOnMount={true}
        >
          <DocumentRevisionListContainer
            documentRevisions={documentRevisions}
            documentId={documentId}
          />
        </AsyncGate>
      </Grid>
      <Grid item={true} xs={6}>
        {documentRevisionId && (
          <DocumentRevisionDisplayContainer
            documentRevisionId={documentRevisionId}
            isNewVersion={isNewVersion}
          />
        )}
      </Grid>
      <Grid item={true} xs={3}>
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
