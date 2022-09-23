import { Box, IconButton, TooltipProps, Typography } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionSidebarProps, SMBox, SMText } from "../../../../..";
import { ReactComponent as BadgeIcon } from "../../../../../../../src/assets/images/badge.svg";
import { ReactComponent as BookmarkIcon } from "../../../../../../../src/assets/images/bookmark.svg";
import { ReactComponent as CollapseIcon } from "../../../../../../../src/assets/images/collapse_icon.svg";
import { ReactComponent as CRIcon } from "../../../../../../../src/assets/images/cr.svg";
import { ReactComponent as EyeIcon } from "../../../../../../../src/assets/images/eye-icon-references.svg";
import { ReactComponent as TimelineIcon } from "../../../../../../../src/assets/images/history.svg";
import { ReactComponent as NoteIcon } from "../../../../../../../src/assets/images/note.svg";
import { ChangeRequest } from "../../../../../../state/ducks/changeRequest/types";
import AccessPermissionsContainer from "../../../../../../ui/documentRevision/accessPermissions/AccessPermissions.container";
import DocumentRevisionAuditContainer from "../../../../../../ui/documentRevision/audit/Audit.container";
import DocumentRevisionListContainer from "../../../../../../ui/documentRevision/DocumentRevisionList.container.new";
import ChangeDocumentFormContainer from "../../../../../../ui/documentRevision/forms/presenters/change.document.form/ChangeDocumentForm.container";
import ReferencesContainer from "../../../../../../ui/documentRevision/References/References.container";
import Bookmarks from "../../../../../../ui/documentRevision/Sidebar/Bookmarks.new";
import RevisionHistory from "../../../../../../ui/documentRevision/Sidebar/RevisionHistory.new";
import SidebarContainer from "../../../../../../ui/documentRevision/Sidebar/Sidebar.container";
import { FBTooltip } from "../../../../../../ui/form.builder";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import { styles, tooltipStyles } from "./DocumentRevisionSidebar.new.styles";
import { withDocumentRevisionSidebarWrap } from "./DocumentRevisionSidebar.wrap";

export const StyledTooltip = (props: TooltipProps) => {
  const classes = tooltipStyles();
  return <FBTooltip arrow placement="left" classes={classes} {...props} />;
};

const DocumentRevisionSidebar: React.FunctionComponent<DocumentRevisionSidebarProps> = ({
  _documentRevisionFormState,
  _documentRevisionSidebarState,
  title,
  documentTypeId = "",
  docRevsWithoutCanceled,
  documentRevisionId = "",
  isInlineApproval = false,
  selectedDocument,
  documentRevisions,
  showFormMigration,
  formDocument,
  documentId = "",
  canAccess,
  isRecord = false,
  isNewOutput = false,
  docId = "",
  intl,
  edit,
}) => {
  const classes = styles(_documentRevisionSidebarState?.open);
  const handleRightPanelToggle = () => {
    _documentRevisionSidebarState?.setOpen();
    _documentRevisionFormState?.setRightPanelOpen();
  };
  return (
    <Observer>
      {() => (
        <Box
          height="100%"
          bgcolor="white"
          width={_documentRevisionSidebarState?.open ? 281 : 48}
          borderColor={Colors.medium_gray}
          className={classes.sidebar}
        >
          <Box display="flex" height={48} alignItems="center">
            <Box width={48} textAlign="center" className={classes.iconBox}>
              <StyledTooltip
                title={
                  _documentRevisionSidebarState?.open ? (
                    <SMText label="common.minimize" />
                  ) : (
                    <SMText label="common.maximize" />
                  )
                }
              >
                <IconButton
                  onClick={handleRightPanelToggle}
                  className={`${classes.iconButtonNew} ${!_documentRevisionSidebarState?.open ? "maximize" : ""}`}
                >
                  <CollapseIcon />
                </IconButton>
              </StyledTooltip>
            </Box>
            <Box width={233}>
              {_documentRevisionSidebarState?.open && (
                <Typography
                  variant="h5"
                  className={classes.tabTitle}
                >
                  <SMText
                    boxProps={{ flexGrow: 1, ml: 1.875 }}
                    label={title || _documentRevisionSidebarState.title}
                  />
                </Typography>
              )}
            </Box>
          </Box>
          <SMBox
            display="flex"
            stretchY="calc(100% - 56px)"
            borderTop={1}
            borderColor={Colors.medium_gray}
          >
            <SidebarContainer
              sidebarList={[
                {
                  icon: <EyeIcon />,
                  type: "references",
                  details: {
                    shouldShow: true,
                    title:
                      intl?.formatMessage({
                        id: "common.references",
                      }) || "",
                    component: (
                      <Box display="flex" flexGrow={1} flexDirection="column">
                        <ReferencesContainer
                          selectedDocument={selectedDocument}
                          edit={edit}
                        />
                        {showFormMigration && (
                          <ChangeDocumentFormContainer
                            docRevId={documentRevisionId || ""}
                            documentTypeId={documentTypeId}
                            sourceSchema={formDocument?.formTemplate?.schema || []}
                            sourceFormId={formDocument?.id || ""}
                          />
                        )}
                      </Box>
                    ),
                  },
                },
                {
                  icon: <NoteIcon />,
                  type: "note",
                  details: {
                    shouldShow: true,
                    title:
                      intl?.formatMessage({
                        id: `document.revision.docVersion.${_documentRevisionFormState?.documentTypeAcronym}`,
                        defaultMessage: "document.revision.docVersion",
                      }) || "",
                    component: (
                      <DocumentRevisionListContainer
                        documentRevisions={docRevsWithoutCanceled || []}
                        selectedDocumentRevision={documentRevisionId}
                        documentTypeId={documentTypeId}
                        {...{
                          isInlineApproval,
                          isRecord,
                          documentId,
                          docId,
                          documentRevisionId,
                          _documentRevisionSidebarState,
                        }}
                      />
                    ),
                  },
                },
                {
                  icon: <TimelineIcon />,
                  type: "history",
                  details: {
                    shouldShow: Boolean(documentRevisionId),
                    dataCy: "timeline-icon",
                    title:
                      intl?.formatMessage({
                        id: "document.revision.history",
                      }) || "",
                    component:
                      documentRevisionId && selectedDocument ? (
                        <DocumentRevisionAuditContainer
                          documentTypeId={documentTypeId}
                          {...{
                            documentRevisionId,
                            selectedDocument,
                          }}
                        />
                      ) : null,
                  },
                },
                {
                  icon: <BadgeIcon />,
                  type: "permissions",
                  details: {
                    shouldShow: Boolean(
                      documentRevisionId && canAccess && !isNewOutput
                    ),
                    dataCy: "permission-icon",
                    title:
                      intl?.formatMessage({
                        id: "document.access.permissions",
                      }) || "",
                    component:
                      documentRevisionId && canAccess && !isNewOutput ? (
                        <AccessPermissionsContainer
                          documentRevisionId={documentRevisionId}
                          documentId={documentId}
                          canAccess={canAccess}
                          documentTypeId={documentTypeId}
                          withoutCurrentUser={true}
                        />
                      ) : null,
                  },
                },
                {
                  icon: <BookmarkIcon />,
                  type: "bookmarks",
                  details: {
                    shouldShow: true,
                    dataCy: "bookmark-icon",
                    title:
                      intl?.formatMessage({
                        id: "document.revision.bookmarks",
                      }) || "",
                    component: <Bookmarks />,
                  },
                },
                {
                  icon: <CRIcon />,
                  type: "crHistory",
                  details: {
                    shouldShow: true,
                    dataCy: "cr-icon",
                    title:
                      intl?.formatMessage({
                        id: "document.revision.cr.history",
                      }) || "",
                    component: (
                      <RevisionHistory
                        documentId={documentId}
                        changeRequests={
                          documentRevisions?.map(
                            (e) => e.changeRequest
                          ) as ChangeRequest[]
                        }
                      />
                    ),
                  },
                },
              ]}
            />
          </SMBox>
        </Box>
      )}
    </Observer>
  );
};

export default withDocumentRevisionSidebarWrap(DocumentRevisionSidebar);
