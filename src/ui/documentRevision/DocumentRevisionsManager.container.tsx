import { Grid } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { connect, useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import { ReactComponent as BadgeIcon } from "../../assets/images/badge.svg";
import { ReactComponent as BookmarkIcon } from "../../assets/images/bookmark.svg";
import { ReactComponent as TimelineIcon } from "../../assets/images/history.svg";
import { ReactComponent as NoteIcon } from "../../assets/images/note.svg";
import { DocumentRevision, documentRevisionsSelectors, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { documentVersionPath } from "../document.revision/utils/paths";
import useDocumentTitle from "../hooks/useDocumentTitle";
import AccessPermissionsContainer from "./accessPermissions/AccessPermissions.container";
import DocumentRevisionAuditContainer from "./audit/Audit.container";
import DocumentRevisionDisplayContainer from "./DocumentRevisionDisplay.container";
import DocumentRevisionListContainer from "./DocumentRevisionList.container";
import { getDocRevIdToRedirect, shouldRedircetToLatestReleasd } from "./helpers";
import Bookmarks from "./Sidebar/Bookmarks";
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
StateProps;

// TO-DO Move To Context Folder
export let documentRevisionStatusContext = React.createContext<DocumentRevisionStatus>(DocumentRevisionStatus.Draft);
export let documentRevisionStatusContextFromDocList = React.createContext< undefined | DocumentRevisionStatus >(undefined);
export let documentRevisionVersionContext = React.createContext<number>(1);

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
  isNewVersion,
  isNewOutput,
  documentId,
  documentRevisionId,
  documentRevisions,
  deprecatedAt,
  docId,
}) => {
  useDocumentTitle(docId);
  const classes = styles();
  const intl = useIntl();
  const url = useLocation();
  const [sidebar, openSidebar] = useState<boolean>(true);

  const docRevsWithoutCanceled = useMemo(() => documentRevisions.filter((docrev) =>
    docrev.status !== DocumentRevisionStatus.Canceled), [documentRevisions]);
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId as string));
  const document = useSelector((state: ApplicationState) => documentRevisionsSelectors.getDocument(state, documentId));
  const canAccess = selectedDocument?.document.canAccess;
  const schema = selectedDocument?.formTemplate?.schema || selectedDocument?.formDocument?.formTemplate?.schema || [];
  const { documentTypeAcronym: acronym } = document?.documentType || {};

  const sidebarList = [
    {
      icon: <NoteIcon />,
      details: {
        title: intl.formatMessage({
          id: `document.revision.docVersion.${acronym}`,
        }),
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
        title: intl.formatMessage({
          id: "document.revision.history",
        }),
        component: documentRevisionId ? <DocumentRevisionAuditContainer
          documentRevisionId={documentRevisionId}
        /> : null,
      },
    },
    {
      icon: <BadgeIcon />,
      details: {
        title: intl.formatMessage({
          id: "document.access.permissions",
        }),
        component: documentRevisionId && canAccess && !isNewOutput ? <AccessPermissionsContainer
          documentRevisionId={documentRevisionId}
          documentId={documentId}
          canAccess={canAccess}
          documentTypeId={document.documentType.id}
          withoutCurrentUser={true}
        /> : null,
      },
    },
    {
      icon: <BookmarkIcon />,
      details: {
        title: intl.formatMessage({
          id: "document.revision.bookmarks",
        }),
        component: <Bookmarks location={url} schema={schema} />,
      },
    },
  ];

  documentRevisionStatusContext = React.createContext(selectedDocument?.status);
  const status = selectedDocument ? selectedDocument.status : undefined;
  documentRevisionStatusContextFromDocList = React.createContext(status);
  documentRevisionVersionContext = React.createContext(selectedDocument?.version);

  useEffect(() => () => {
    documentRevisionStatusContextFromDocList = React.createContext<undefined | DocumentRevisionStatus>(undefined);
  }, []);

  if (shouldRedircetToLatestReleasd(documentRevisions, documentRevisionId)) {
    const docRevIdToRedirect = getDocRevIdToRedirect(documentRevisions, deprecatedAt);
    return (
      <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />
    );
  }

  return (
    <Grid container={true} className={classes.whiteContainer} style={{ width: sidebar ? "100%" : "104%" }}>
      {documentRevisionId && !isNewOutput && (
        <Grid item={true} xs={sidebar ? 9 : 11} className={classes.backColor}>
          <DocumentRevisionDisplayContainer
            documentRevisionId={documentRevisionId}
            isNewVersion={isNewVersion}
            documentId={documentId}
          />
        </Grid>
      )}
      {documentRevisionId && isNewOutput && (
        <Grid item={true} xs={sidebar ? 9 : 11} className={classes.backColor}>
          <DocumentRevisionDisplayContainer
            documentRevisionId={documentRevisionId}
            isNewOutput={isNewOutput}
            documentId={documentId}
          />
        </Grid>
      )}
      <SidebarContainer {...{ sidebar, openSidebar, sidebarList }}/>
    </Grid>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(DocumentRevisionManagerContainer);
