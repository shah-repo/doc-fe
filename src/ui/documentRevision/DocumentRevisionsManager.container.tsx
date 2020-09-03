import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { connect, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { ReactComponent as BadgeIcon } from "../../assets/images/badge.svg";
import { ReactComponent as BookmarkIcon } from "../../assets/images/bookmark.svg";
import { ReactComponent as CRIcon } from "../../assets/images/cr.svg";
import { ReactComponent as TimelineIcon } from "../../assets/images/history.svg";
import { ReactComponent as NoteIcon } from "../../assets/images/note.svg";
import { DocumentRevision, documentRevisionsSelectors, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import { DocumentGroupType } from "../../state/ducks/documentRevisions/documentType";
import { ApplicationState } from "../../state/reducers";
import { documentVersionPath } from "../document.revision/utils/paths";
import { FB, FBBookmarkState, FBProvider } from "../form.builder";
import { FBDocTypeGroup } from "../form.builder/FBApprovalMatrixTable";
import useDocumentTitle from "../hooks/useDocumentTitle";
import AccessPermissionsContainer from "./accessPermissions/AccessPermissions.container";
import DocumentRevisionAuditContainer from "./audit/Audit.container";
import DocumentRevisionDisplayContainer from "./DocumentRevisionDisplay.container";
import DocumentRevisionListContainer from "./DocumentRevisionList.container";
import { getDocRevIdToRedirect, shouldRedircetToLatestReleasd } from "./helpers";
import Bookmarks from "./Sidebar/Bookmarks";
import RevisionHistory from "./Sidebar/RevisionHistory";
import { SidebarContainer } from "./Sidebar/Sidebar.container";
import { Sidebar } from "./Sidebar/types";
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
export let documentRevisionStatusContextFromDocList = React.createContext<undefined | DocumentRevisionStatus>(undefined);
export let documentRevisionTypeGroupsFromDocListContext = React.createContext<undefined | DocumentGroupType>(undefined);
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
  const bookmarkState = FB.useRef<FBBookmarkState>(FBBookmarkState);
  const [isDrawerOpen, setOpen] = React.useState(true);
  const classes = styles({ isDrawerOpen });
  const intl = useIntl();

  const docRevsWithoutCanceled = useMemo(() => documentRevisions.filter((docrev) =>
    docrev.status !== DocumentRevisionStatus.Canceled), [documentRevisions]);
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId as string));
  const document = useSelector((state: ApplicationState) => documentRevisionsSelectors.getDocument(state, documentId));
  const canAccess = selectedDocument?.document.canAccess;
  const { documentTypeAcronym: acronym } = document?.documentType || {};

  const isInlineApproval =
    !!docRevsWithoutCanceled.find(
      (e) => e.formDocument?.formTemplate?.schema.some((e) =>
        (e.type === "approval" || e.type === "inlineapproval" as string))
    ) ||
    !!selectedDocument?.formDocument?.formTemplate?.schema.some((e) =>
      (e.type === "approval" || e.type === "inlineapproval" as string));

  const isRecord =
    !!docRevsWithoutCanceled.find(
      (e) => (e.document?.documentType?.groupOptions || []).includes(FBDocTypeGroup.RECORD)) ||
    (!!selectedDocument?.document?.documentType?.groupOptions?.includes(FBDocTypeGroup.RECORD) || false);

  const sidebarList: Sidebar[] = [
    {
      icon: <NoteIcon />,
      type: "note",
      details: {
        title: intl.formatMessage({
          id: `document.revision.docVersion.${acronym}`,
          defaultMessage: "document.revision.docVersion",
        }),
        component: <DocumentRevisionListContainer
          documentRevisions={docRevsWithoutCanceled}
          isInlineApproval={isInlineApproval}
          isRecord={isRecord}
          documentId={documentId}
          docId={docId}
          selectedDocumentRevision={documentRevisionId}
          documentRevisionId={documentRevisionId}
        />,
      },
    },
    {
      icon: <TimelineIcon />,
      type: "history",
      details: {
        dataCy: "timeline-icon",
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
      type: "permissions",
      details: {
        dataCy: "permission-icon",
        title: intl.formatMessage({
          id: "document.access.permissions",
        }),
        component: documentRevisionId && canAccess && !isNewOutput ? <AccessPermissionsContainer
          documentRevisionId={documentRevisionId}
          documentId={documentId}
          canAccess={canAccess}
          documentTypeId={document.documentType?.id}
          withoutCurrentUser={true}
        /> : null,
      },
    },
    {
      icon: <BookmarkIcon />,
      type: "bookmarks",
      details: {
        dataCy: "bookmark-icon",
        title: intl.formatMessage({
          id: "document.revision.bookmarks",
        }),
        component: <Bookmarks />,
      },
    },
    {
      icon: <CRIcon />,
      type: "crHistory",
      details: {
        dataCy: "cr-icon",
        title: intl.formatMessage({
          id: "document.revision.cr.history",
        }),
        component: <RevisionHistory changeRequests={documentRevisions.map((e) => e.changeRequest)} />,
      },
    },
  ];

  documentRevisionStatusContext = React.createContext(selectedDocument?.status);
  const status = selectedDocument ? selectedDocument.status : undefined;
  documentRevisionStatusContextFromDocList = React.createContext(status);
  documentRevisionTypeGroupsFromDocListContext = React.createContext(selectedDocument?.document.documentType.group);
  documentRevisionVersionContext = React.createContext(selectedDocument?.version);

  useEffect(() => () => {
    documentRevisionStatusContextFromDocList = React.createContext<undefined | DocumentRevisionStatus>(undefined);
    documentRevisionTypeGroupsFromDocListContext = React.createContext<undefined | DocumentGroupType>(undefined);

  }, []);

  if (shouldRedircetToLatestReleasd(documentRevisions, documentRevisionId)) {
    const docRevIdToRedirect = getDocRevIdToRedirect(documentRevisions, deprecatedAt);
    return (
      <Redirect to={documentVersionPath(docRevIdToRedirect, documentId)} />
    );
  }

  return (
    <FBProvider {...{ bookmarkState }}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          {documentRevisionId && !isNewOutput && (
            <DocumentRevisionDisplayContainer
              documentRevisionId={documentRevisionId}
              isNewVersion={isNewVersion}
              documentId={documentId}
            />
          )}
          {documentRevisionId && isNewOutput && (
            <DocumentRevisionDisplayContainer
              documentRevisionId={documentRevisionId}
              isNewOutput={isNewOutput}
              documentId={documentId}
            />
          )}
        </div>
        <SidebarContainer {...{ isDrawerOpen, setOpen, sidebarList }} />
      </div>
    </FBProvider>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(DocumentRevisionManagerContainer);
