import { Grid, withStyles, WithStyles } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { DocumentRevision, documentRevisionsSelectors, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { documentVersionPath } from "../document.revision/utils/paths";
import useDocumentTitle from "../hooks/useDocumentTitle";
import DocumentRevisionDisplayContainer from "./DocumentRevisionDisplay.container";
import { getDocRevIdToRedirect, shouldRedircetToLatestReleasd } from "./helpers";
import { SidebarContainer } from "./Sidebar/Sidebar.container";
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
  useDocumentTitle(docId);
  const docRevsWithoutCanceled = documentRevisions.filter((docrev) =>
    docrev.status !== DocumentRevisionStatus.Canceled);
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId as string));
  const canAccess = _.get(selectedDocument, "document.canAccess", []);

  const [sidebar, openSidebar] = useState<boolean>(false);

  if (shouldRedircetToLatestReleasd(documentRevisions, documentRevisionId)) {
    const docRevIdToRedirect = getDocRevIdToRedirect(documentRevisions, deprecatedAt);
    return (
      <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />
    );
  }

  return (
    <Grid container={true} spacing={2} className={classes.whiteContainer}>
      {documentRevisionId && !isNewOutput && (
        <Grid item={true} xs={sidebar ? 9 : 11}>
          <DocumentRevisionDisplayContainer
            documentRevisionId={documentRevisionId}
            isNewVersion={isNewVersion}
            documentId={documentId}
          />
        </Grid>
      )}
      {documentRevisionId && isNewOutput && (
        <Grid item={true} xs={sidebar ? 9 : 11}>
          <DocumentRevisionDisplayContainer
            documentRevisionId={documentRevisionId}
            isNewOutput={isNewOutput}
            documentId={documentId}
          />
        </Grid>
      )}
      <SidebarContainer
        {...{
          docRevsWithoutCanceled,
          documentId,
          docId,
          documentRevisionId,
          canAccess,
          isNewOutput,
          sidebar,
          openSidebar,
        }}
      />
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(
  withStyles(styles)(DocumentRevisionManagerContainer),
);
