import { Grid, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  DocumentRevision,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { documentVersionPath } from "../document.revision/utils/paths";
import AccessPermissionsContainer from "./accessPermissions/AccessPermissions.container";
import DocumentRevisionAuditContainer from "./audit/Audit.container";
import DocumentRevisionDisplayContainer from "./DocumentRevisionDisplay.container";
import DocumentRevisionListContainer from "./DocumentRevisionList.container";
import { getDocRevIdToRedirect, shouldRedircetToLatestReleasd } from "./helpers";
import styles from "./styles";

interface StateProps {
  documentRevisions: DocumentRevision[];
  docId: string;
}

interface OwnProps {
  documentId: string;
  documentRevisionId: string | null;
  isNewVersion: boolean;
  isNewOutput: boolean;
  deprecatedAt: string;
}

export type DocumentRevisionManagerContainerProps = OwnProps &
  StateProps &
  WithStyles<typeof styles>;

const getDocumentRevisions = documentRevisionsSelectors.makeGetDocumentRevisions();
const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  documentRevisions: getDocumentRevisions(state, props.documentId),
  docId: documentRevisionsSelectors.getDocId(state, props.documentId),
});

export const DocumentRevisionManagerContainer: React.FunctionComponent<
  DocumentRevisionManagerContainerProps
> = ({
  classes,
  isNewVersion,
  isNewOutput,
  documentId,
  documentRevisionId,
  documentRevisions,
  deprecatedAt,
  docId,
}) => {

    if (shouldRedircetToLatestReleasd(documentRevisions, documentRevisionId)) {
      const docRevIdToRedirect = getDocRevIdToRedirect(documentRevisions, deprecatedAt);
      return (
        <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />
      );
    }

    return (
      <Grid container={true} spacing={2} className={classes.whiteContainer}>
        <Grid item={true} xs={2} className={classes.sidebar}>
          <DocumentRevisionListContainer
            documentRevisions={documentRevisions}
            documentId={documentId}
            docId={docId}
            selectedDocumentRevision={documentRevisionId!}
            documentRevisionId={documentRevisionId}
          />
          </Grid>
        {documentRevisionId && !isNewOutput && (
          <Grid item={true} xs={7}>
            <DocumentRevisionDisplayContainer
              documentRevisionId={documentRevisionId}
              isNewVersion={isNewVersion}
              documentId={documentId}
            />
          </Grid>
        )}
        {documentRevisionId && isNewOutput && (
          <Grid item={true} xs={7}>
            <DocumentRevisionDisplayContainer
              documentRevisionId={documentRevisionId}
              isNewOutput={isNewOutput}
              documentId={documentId}
            />
          </Grid>
        )}
        <Grid item={true} xs={3} className={classes.sidebar}>
          {documentRevisionId && (
            <DocumentRevisionAuditContainer
              documentRevisionId={documentRevisionId}
            />
          )}
          {documentRevisionId && (
            <AccessPermissionsContainer
              documentRevisionId={documentRevisionId}
              documentId={documentId}
              canAccess={false}
              withoutCurrentUser={true}
            />
          )}
        </Grid>
      </Grid>
    );
  };

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(
  withStyles(styles)(DocumentRevisionManagerContainer),
);
