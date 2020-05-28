import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ReactComponent as BadgeIcon } from "../../../assets/images/badge.svg";
import { ReactComponent as BookmarkIcon } from "../../../assets/images/bookmark.svg";
import { ReactComponent as TimelineIcon } from "../../../assets/images/history.svg";
import { ReactComponent as NoteIcon } from "../../../assets/images/note.svg";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../state/reducers";
import DocumentRevisionAuditContainer from "../../documentRevision/audit/Audit.container";
import { FBSchemaProps } from "../../form.builder";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import AccessPermissionsContainer from "../accessPermissions/AccessPermissions.container";
import DocumentRevisionListContainer from "../DocumentRevisionList.container";
import Bookmarks from "./Bookmarks";
import SidebarPresenter from "./Sidebar.presenter";

interface SidebarContainerProps {
  documentId: string;
  documentRevisionId: string | null;
  isNewOutput: boolean;
  docRevsWithoutCanceled: DocumentRevision[];
  canAccess: boolean;
  docId: string;
  sidebar: boolean;
  openSidebar: (value: boolean) => void;
  fbTemplate: FBSchemaProps[];
}

export const SidebarContainer: React.FunctionComponent<
SidebarContainerProps
> = ({
  docRevsWithoutCanceled,
  documentId,
  docId,
  documentRevisionId,
  canAccess,
  isNewOutput,
  sidebar,
  openSidebar,
  fbTemplate,
}) => {
  const document = useSelector((state: ApplicationState) => documentRevisionsSelectors.getDocument(state, documentId));
  const { documentTypeAcronym: acronym } = document?.documentType || {};
  const [indexNumber, setIndex] = useState(0);
  const intl = useIntl();
  const url = useLocation();

  useScrollIntoView();

  const inputRef = useRef(null);

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
        component: <Bookmarks location={url} fbTemplate={fbTemplate} />,
      },
    },
  ];

  const changeSize = () => {
    openSidebar(!sidebar);
    if (sidebar) {
      setIndex(0);
    }
    if (inputRef && !sidebar) {
      const input = inputRef.current as any;
      input.focus();
      input.click();
    }
  };
  const handleMenuIconClick = (index: number) => {
    if (!sidebar) {
      openSidebar(!sidebar);
      setIndex(index);
      return;
    }
    setIndex(index);
  };

  return (
    <SidebarPresenter
      {...{
        sidebar,
        changeSize,
        indexNumber,
        sidebarList,
        inputRef,
        setIndex,
        handleMenuIconClick,
      }}
    />
  );
};

export default SidebarContainer;
