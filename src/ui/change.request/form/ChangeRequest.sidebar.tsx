import { Box, IconButton, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { SMBox, SMText } from "../../../App";
import CRStyles from "../../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.new.styles";
import { ReactComponent as CollapseIcon } from "../../../assets/images/collapse_icon.svg";
import SidebarContainer from "../../documentRevision/Sidebar/Sidebar.container";
import Colors from "../../layout/theme/utils/colors";
import { Sidebar as SidebarTypes } from "../../documentRevision/Sidebar/types";
import { ReactComponent as BookmarkIcon } from "../../../assets/images/bookmark.svg";
import { ReactComponent as EyeIcon } from "../../../assets/images/eye-icon-references.svg";
import { ReactComponent as TimelineIcon } from "../../../assets/images/history.svg";
import { useIntl } from "react-intl";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import ChangeRequestAuditContainer from "../../change.request/audit/Audit.container";
import CRReferences from "../../change.request/references/Reference";
import Bookmarks from "../../documentRevision/Sidebar/Bookmarks.new";
import { FBTooltip } from "../../form.builder";

interface Props {
  changeRequest: ChangeRequest;
  setOpen: (value: boolean) => void;
  isDrawerOpen: boolean;
  fromEdit?: boolean;
}

const ChangeRequestSidebar: React.FunctionComponent<Props> = ({
  changeRequest,
  isDrawerOpen,
  setOpen,
  fromEdit,
}) => {

  const intl = useIntl();

  const [tab, setTab] = useState(0);
  const crClasses = CRStyles(isDrawerOpen);

  const sidebarList: SidebarTypes[] = [
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
          <CRReferences
            changeRequest={changeRequest}
          />
        ),
      },
    },
    {
      icon: <TimelineIcon />,
      type: "history",
      details: {
        shouldShow: Boolean(changeRequest),
        dataCy: "timeline-icon",
        title: intl.formatMessage({
          id: "document.revision.history",
        }),
        component: changeRequest ?
          <ChangeRequestAuditContainer changeRequest={changeRequest} isDrawerOpen={isDrawerOpen} />
          : null,
      },
    }, {
      icon: <BookmarkIcon />,
      type: "bookmarks",
      details: {
        shouldShow: true,
        dataCy: "bookmark-icon",
        title: intl.formatMessage({
          id: "document.revision.bookmarks",
        }),
        component: <Bookmarks />,
      },
    },
  ];

  return (
    <Box
      height="100%"
      bgcolor="white"
      width={isDrawerOpen ? 281 : 48}
      marginTop={fromEdit ? 0.25 : 1.25}
      borderColor={Colors.medium_gray}
      className={crClasses.sidebar}
    >
      <Box display="flex" height={48} alignItems="center">
        <Box width={48} textAlign="center" className={crClasses.iconBox}>
          <FBTooltip
            placement="left"
            title={
              isDrawerOpen ? (
                <SMText label="common.minimize" />
              ) : (
                <SMText label="common.maximize" />
              )
            }
          >
            <IconButton
              onClick={() => setOpen(!isDrawerOpen)}
              className={`${crClasses.iconButtonNew} ${!isDrawerOpen ? "maximize" : ""}`}
            >
              <CollapseIcon />
            </IconButton>
          </FBTooltip>
        </Box>
        <Box width={233}>
          {isDrawerOpen && (
            <Typography
              variant="h5"
              className={crClasses.tabTitle}
            >
              <SMText
                boxProps={{ flexGrow: 1, ml: 2 }}
                label={sidebarList[tab].details.title}
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
          sidebarList = {sidebarList}
          {...{ isDrawerOpen, setOpen, setTab }} />
      </SMBox>
    </Box>
  );
};

export default ChangeRequestSidebar;
