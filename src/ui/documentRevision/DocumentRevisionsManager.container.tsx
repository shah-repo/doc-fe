import { Box, Grid, IconButton, Slide, Typography, withStyles, WithStyles } from "@material-ui/core";
import _ from "lodash";
import React, { useRef, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { ReactComponent as BadgeIcon } from "../../assets/images/badge-15.svg";
import { ReactComponent as SidebarCloseIcon } from "../../assets/images/move-down.svg";
import { ReactComponent as SidebarOpenIcon } from "../../assets/images/move-up.svg";
import { ReactComponent as NoteIcon } from "../../assets/images/note.svg";
import { ReactComponent as TimelineIcon } from "../../assets/images/timeline.svg";
import { DocumentRevision, documentRevisionsSelectors, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import DocumentRevisionAuditContainer from "../documentRevision/audit/Audit.container";
import useDocumentTitle from "../hooks/useDocumentTitle";
import AccessPermissionsContainer from "./accessPermissions/AccessPermissions.container";
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
  useDocumentTitle(docId);
  const docRevsWithoutCanceled = documentRevisions.filter((docrev) => docrev.status !== DocumentRevisionStatus.Canceled);
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId as string));
  const canAccess = _.get(selectedDocument, "document.canAccess", []);

  const sidebarList = [
    {
      icon: <NoteIcon />,
      details: {
        title: "Versions",
        component: <DocumentRevisionListContainer
          documentRevisions={docRevsWithoutCanceled}
          documentId={documentId}
          docId={docId}
          selectedDocumentRevision={documentRevisionId}
          documentRevisionId={documentRevisionId}
        />,
      },
    },
    {
      icon: <TimelineIcon />,
      details: {
        title: "History",
        component: documentRevisionId ? <DocumentRevisionAuditContainer
          documentRevisionId={documentRevisionId}
        /> : null,
      },
    },
    {
      icon: <BadgeIcon />,
      details: {
        title: "Access Permissions",
        component: documentRevisionId && canAccess && !isNewOutput ? <AccessPermissionsContainer
          documentRevisionId={documentRevisionId}
          documentId={documentId}
          canAccess={canAccess}
          withoutCurrentUser={true}
        /> : null,
      },
    },
    // ENC-3193
    // {
    //   icon: <BookmarkIcon />,
    //   details: {
    //     title: "Bookmarks",
    //     component: <Box />,
    //   },
    // },
  ];
  const [sidebar, openSidebar] = useState<boolean>(false);
  const [number, setNumber] = useState(0);


  const inputRef = useRef(null);

  if (shouldRedircetToLatestReleasd(documentRevisions, documentRevisionId)) {
    const docRevIdToRedirect = getDocRevIdToRedirect(documentRevisions, deprecatedAt);
    return (
      <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />
    );
  }

  const changeSize = () => {
    openSidebar(!sidebar);
    if (sidebar) {
      setNumber(0);
    }
    if (inputRef && !sidebar) {
      const input = inputRef.current as any;
      input.focus();
      input.click();
      return;
    }
  };

  return (
    <Grid container={true} spacing={2} className={classes.whiteContainer}>
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
              <IconButton onClick={() => changeSize()} className={classes.openButton}>
                {sidebar ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
              </IconButton>
            </Box>
            {sidebarList.map((item, index) =>
              <Box key={item.details.title}>
                <IconButton
                  ref={sidebarList[number].details.title === item.details.title ? inputRef : null}
                  onClick={() => setNumber(index)}
                  className={classes.iconButton}
                >
                  {item.icon}
                </IconButton>
              </Box>
            )}
          </Grid>
          <Slide direction="up" in={sidebar} mountOnEnter unmountOnExit>
            <Grid
              item={true}
              xs={11}
              style={{
                display: sidebar ? "block" : "none",
                padding: 0,
                width: 260,
                position: "fixed",
                marginLeft: 78,
              }}>
              <Box padding={2} paddingLeft={4} className={classes.sidebarItemTitle}>
                <Typography variant="button">
                  <Text message={sidebarList[number].details.title} />
                </Typography>
              </Box>
              <Box top={60} position="absolute" width={260} className={classes.sidebarContent}>
                {sidebarList[number].details.component}
              </Box>
            </Grid>
          </Slide>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(
  withStyles(styles)(DocumentRevisionManagerContainer),
);
