import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { ReactComponent as BadgeIcon } from "../../../assets/images/badge-15.svg";
import { ReactComponent as NoteIcon } from "../../../assets/images/note.svg";
import { ReactComponent as TimelineIcon } from "../../../assets/images/timeline.svg";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../state/reducers";
import DocumentRevisionAuditContainer from "../../documentRevision/audit/Audit.container";
import AccessPermissionsContainer from "../accessPermissions/AccessPermissions.container";
import DocumentRevisionListContainer from "../DocumentRevisionList.container";
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
}) => {
  const document = useSelector((state: ApplicationState) => documentRevisionsSelectors.getDocument(state, documentId));
  const { documentTypeAcronym: acronym } = document?.documentType || {};
  const [indexNumber, setIndex] = useState(0);
  const intl = useIntl();


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


  const changeSize = () => {
    openSidebar(!sidebar);
    if (sidebar) {
      setIndex(0);
    }
    if (inputRef && !sidebar) {
      const input = inputRef.current as any;
      input.focus();
      input.click();
      return;
    }
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
      }}
    />
  );
};

export default SidebarContainer;
