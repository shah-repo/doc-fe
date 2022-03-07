import { Box, IconButton, Typography } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import KeyboardTabIcon from "@material-ui/icons/KeyboardTab";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionSidebarProps, SMBox, SMText } from "../../../../..";
import { ReactComponent as BadgeIcon } from "../../../../../../../src/assets/images/badge.svg";
import { ReactComponent as BookmarkIcon } from "../../../../../../../src/assets/images/bookmark.svg";
import { ReactComponent as CRIcon } from "../../../../../../../src/assets/images/cr.svg";
import { ReactComponent as EyeIcon } from "../../../../../../../src/assets/images/eye-icon-references.svg";
import { ReactComponent as TimelineIcon } from "../../../../../../../src/assets/images/history.svg";
import { ReactComponent as MigrationIcon } from "../../../../../../../src/assets/images/migration.svg";
import { ReactComponent as NoteIcon } from "../../../../../../../src/assets/images/note.svg";
import { ChangeRequest } from "../../../../../../state/ducks/changeRequest/types";
import AccessPermissionsContainer from "../../../../../../ui/documentRevision/accessPermissions/AccessPermissions.container";
import DocumentRevisionAuditContainer from "../../../../../../ui/documentRevision/audit/Audit.container";
import DocumentRevisionListContainer from "../../../../../../ui/documentRevision/DocumentRevisionList.container";
import ChangeDocumentFormContainer from "../../../../../../ui/documentRevision/forms/presenters/change.document.form/ChangeDocumentForm.container";
import ReferencesContainer from "../../../../../../ui/documentRevision/References/References.container";
import Bookmarks from "../../../../../../ui/documentRevision/Sidebar/Bookmarks";
import RevisionHistory from "../../../../../../ui/documentRevision/Sidebar/RevisionHistory";
import SidebarContainer from "../../../../../../ui/documentRevision/Sidebar/Sidebar.container";
import Colors from "../../../../../../ui/layout/theme/utils/colors";
import { withDocumentRevisionSidebarWrap } from "./DocumentRevisionSidebar.wrap";

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
}) =>  (
  <Observer>
    {() => (
      <Box
        height="100%"
        bgcolor="white"
        width={_documentRevisionSidebarState?.open ? 300 : 55}
        borderColor={Colors.medium_gray}
        style={{
          transition: _documentRevisionSidebarState?.open ? "all .2s ease-in-out" : " all .2s ease-in-out",
          background: "#FFFFFF",
          boxShadow: "inset -1px 0px 0px #CCD4D9",
          borderRadius: "7px 0px 0px 7px",
        }}
      >
        <Box
          display="flex"
          height={48}
          alignItems="center"
          marginTop="10px"
        >
          <Box width={48} textAlign="center" style={{ borderRight: "1px solid rgb(212, 219, 225)" }}>
            <IconButton onClick={_documentRevisionSidebarState?.setOpen}>
              {_documentRevisionSidebarState?.open && <KeyboardTabIcon />}
              {!_documentRevisionSidebarState?.open && <KeyboardBackspaceIcon />}
            </IconButton>
          </Box>
          {_documentRevisionSidebarState?.open && (
            <Typography variant="button">
              <SMText
                boxProps={{ flexGrow: 1, ml: 2, fontSize: "button" }}
                label={title || _documentRevisionSidebarState.title}
              />
            </Typography>
          )}
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
                  title: "References",
                  component: (
                    <ReferencesContainer selectedDocument={selectedDocument} />
                  ),
                },
              },
              {
                icon: <NoteIcon />,
                type: "note",
                details: {
                  shouldShow: true,
                  title: intl?.formatMessage({
                    id: `document.revision.docVersion.${_documentRevisionFormState?.documentTypeAcronym}`,
                    defaultMessage: "document.revision.docVersion",
                  }) || "",
                  component: (
                    <DocumentRevisionListContainer
                      documentRevisions={docRevsWithoutCanceled || []}
                      selectedDocumentRevision={documentRevisionId}
                      documentTypeId={documentTypeId}
                      {
                        ...{
                          isInlineApproval,
                          isRecord,
                          documentId,
                          docId,
                          documentRevisionId,
                        }
                      }
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
                  title: intl?.formatMessage({
                    id: "document.revision.history",
                  }) || "",
                  component: (documentRevisionId && selectedDocument) ? (
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
                  shouldShow: Boolean(documentRevisionId && canAccess && !isNewOutput),
                  dataCy: "permission-icon",
                  title: intl?.formatMessage({
                    id: "document.access.permissions",
                  }) || "",
                  component: (documentRevisionId && canAccess && !isNewOutput) ? (
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
                  title: intl?.formatMessage({
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
                  title: intl?.formatMessage({
                    id: "document.revision.cr.history",
                  }) || "",
                  component: <RevisionHistory changeRequests={documentRevisions?.map((e) =>
                    e.changeRequest) as ChangeRequest[]} />,
                },
              },
              {
                icon: <MigrationIcon />,
                type: "formMigration",
                details: {
                  shouldShow: showFormMigration,
                  dataCy: "form-migration-icon",
                  title: intl?.formatMessage({
                    id: "common.form.migration",
                  }) || "",
                  component: showFormMigration ? (
                    <ChangeDocumentFormContainer
                      docRevId={documentRevisionId || ""}
                      documentTypeId={documentTypeId}
                      sourceSchema={formDocument?.formTemplate?.schema || []}
                      sourceFormId={formDocument?.id || ""}
                    />
                  ) : null,
                },
              },
            ]
            }
          />
        </SMBox>
      </Box>
    )}
  </Observer>
);

export default withDocumentRevisionSidebarWrap(DocumentRevisionSidebar);
