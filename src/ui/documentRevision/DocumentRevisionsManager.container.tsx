import { Box, Grid, IconButton, Typography, withStyles, WithStyles } from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { ReactComponent as BadgeIcon } from "../../assets/images/badge-15.svg";
import { ReactComponent as BookmarkIcon } from "../../assets/images/bookmark-2.svg";
import { ReactComponent as SidebarCloseIcon } from "../../assets/images/move-down.svg";
import { ReactComponent as SidebarOpenIcon } from "../../assets/images/move-up.svg";
import { ReactComponent as NoteIcon } from "../../assets/images/note.svg";
import { ReactComponent as TimelineIcon } from "../../assets/images/timeline.svg";
import { DocumentRevision, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import useDocumentTitle from "../hooks/useDocumentTitle";
import DocumentRevisionDisplayContainer from "./DocumentRevisionDisplay.container";
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
  useDocumentTitle(docId);
  const [sidebar, openSidebar] = useState<boolean>(false);

  // const selectedDocument = useSelector((state: ApplicationState) =>
  //   documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId as string));

  if (shouldRedircetToLatestReleasd(documentRevisions, documentRevisionId)) {
    const docRevIdToRedirect = getDocRevIdToRedirect(documentRevisions, deprecatedAt);
    return (
      <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />
    );
  }
  // const canAccess = _.get(selectedDocument, "document.canAccess", []);
  // const docRevsWithoutCanceled = documentRevisions.filter((docrev) => docrev.status !== DocumentRevisionStatus.Canceled);
  const changeSize = () => {
    openSidebar(!sidebar);
  };
  return (
    <Grid container={true} spacing={2} className={classes.whiteContainer}>
      {/* <Grid item={true} xs={2} className={classes.sidebar}>
        <DocumentRevisionListContainer
          documentRevisions={docRevsWithoutCanceled}
          documentId={documentId}
          docId={docId}
          selectedDocumentRevision={documentRevisionId}
          documentRevisionId={documentRevisionId}
        />
      </Grid> */}
      {documentRevisionId && !isNewOutput && (
        <Grid item={true} xs={sidebar ? 9 : 11} style={{ background: "#F2F4F6" }}>
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
      {/* <Grid item={true} xs={3} className={classes.sidebar}>
        {documentRevisionId && (
          <DocumentRevisionAuditContainer
            documentRevisionId={documentRevisionId}
          />
        )}
        {documentRevisionId && canAccess && !isNewOutput && (
          <AccessPermissionsContainer
            documentRevisionId={documentRevisionId}
            documentId={documentId}
            canAccess={canAccess}
            withoutCurrentUser={true}
          />
        )}
      </Grid> */}
      <Grid item={true} xs={sidebar ? 3 : 1} style={{ position: "sticky", paddingLeft: "4px" }}>
        <Grid container={true} style={{ height: "100%" }}>
          <Grid item={true} xs={1}
            style={{
              borderRight: sidebar ? "2px solid lightgray" : "none",
              position: "fixed",
              height: "100%",
              paddingLeft: sidebar ? "none" : 4,
            }}>
            <Box borderBottom="1px solid lightgray" width="max-content" marginRight={1} >
              <IconButton onClick={() => changeSize()} className={classes.iconButton}>
                {sidebar ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
              </IconButton>
            </Box>
            <Box>
              <IconButton onClick={() => changeSize()} className={classes.iconButton}>
                <NoteIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton onClick={() => changeSize()} className={classes.iconButton}>
                <TimelineIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton onClick={() => changeSize()} className={classes.iconButton}>
                <BadgeIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton onClick={() => changeSize()} className={classes.iconButton}>
                <BookmarkIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid
            item={true}
            xs={11}
            style={{
              display: sidebar ? "block" : "none",
              padding: 0,
              marginLeft: 78,
              position: "fixed",
              width: "265px",
            }}>
            <Box padding={2}>
              <Typography variant="button">
                <Text message={"Sara"} />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(
  withStyles(styles)(DocumentRevisionManagerContainer),
);
