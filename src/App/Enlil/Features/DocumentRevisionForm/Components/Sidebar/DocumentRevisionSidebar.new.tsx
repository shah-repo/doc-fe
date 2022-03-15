import { Box, createStyles, IconButton, makeStyles, TooltipProps, Typography } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionSidebarProps, SMBox, SMText } from "../../../../..";
import { ReactComponent as BadgeIcon } from "../../../../../../../src/assets/images/badge.svg";
import { ReactComponent as BookmarkIcon } from "../../../../../../../src/assets/images/bookmark.svg";
import { ReactComponent as CollapseIcon } from "../../../../../../../src/assets/images/collapse_icon.svg";
import { ReactComponent as CRIcon } from "../../../../../../../src/assets/images/cr.svg";
import { ReactComponent as EyeIcon } from "../../../../../../../src/assets/images/eye-icon-references.svg";
import { ReactComponent as TimelineIcon } from "../../../../../../../src/assets/images/history.svg";
import { ReactComponent as MigrationIcon } from "../../../../../../../src/assets/images/migration.svg";
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
import { withDocumentRevisionSidebarWrap } from "./DocumentRevisionSidebar.wrap";

const tooltipClasses = makeStyles(() => ({
  tooltip: {
    backgroundColor: Colors.almost_black,
    fontSize: "12px",
    fontFamily: "Sora",
    fontWeight: 400,
  },
  arrow: {
    color: Colors.almost_black,
  },
}));

const StyledTooltip = (props: TooltipProps) => {
  const classes = tooltipClasses();
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
  const styles = makeStyles(() =>
    createStyles({
      sidebar: {
        transition: _documentRevisionSidebarState?.open
          ? "all .2s ease-in-out"
          : " all .2s ease-in-out",
        background: Colors.white,
        filter: `drop-shadow(0px 4px 24px rgba(22, 34, 41, 0.06))`,
        borderRadius: "7px",
        marginRight: "10px",
      },
      iconBox: {
        minWidth: "48px",
        display: "flex",
        height: "48px",
        alignItems: "center",
        justifyContent: "center",
        borderRight: `1px solid ${Colors.light_gray_border}`,
      },
      iconButtonNew: {
        "width": "36px",
        "height": "30px",
        "padding": "0px",
        "&:hover, &:focus, li.active > a": {
          "background": Colors.light_blue,
          "borderRadius": "5px",
          "& svg": {
            stroke: Colors.medium_blue,
          },
        },
        "& svg": {
          stroke: Colors.hint_gray,
        },
        "&.maximize": {
          transform: `scaleX(-1)`,
        },
      },
      tabTitle: {
        fontFamily: "Sora",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "18px",
        color: Colors.dark_jungle_green,
      },
    }));
  const classes = styles();
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
          <Box display="flex" height={48} alignItems="center" marginTop="10px">
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
                  onClick={_documentRevisionSidebarState?.setOpen}
                  className={`${classes.iconButtonNew} ${!_documentRevisionSidebarState?.open ? "maximize" : ""}`}
                >
                  <CollapseIcon />
                </IconButton>
              </StyledTooltip>
            </Box>
            <Box width={233}>
              {_documentRevisionSidebarState?.open && (
                <Typography
                  className={classes.tabTitle}
                >
                  <SMText
                    boxProps={{ flexGrow: 1, ml: 2 }}
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
                      <ReferencesContainer
                        selectedDocument={selectedDocument}
                        edit={edit}
                      />
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
                {
                  icon: <MigrationIcon />,
                  type: "formMigration",
                  details: {
                    shouldShow: showFormMigration,
                    dataCy: "form-migration-icon",
                    title:
                      intl?.formatMessage({
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
              ]}
            />
          </SMBox>
        </Box>
      )}
    </Observer>
  );
};

export default withDocumentRevisionSidebarWrap(DocumentRevisionSidebar);
