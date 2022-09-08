import { Box, IconButton, TooltipProps, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { SMBox, SMText } from "../../../App";
import { styles as CRStyles, tooltipStyles } from "../../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.new.styles";
import { ReactComponent as CollapseIcon } from "../../../assets/images/collapse_icon.svg";
import SidebarContainer from "../../documentRevision/Sidebar/Sidebar.container";
import { Sidebar as SidebarTypes } from "../../documentRevision/Sidebar/types";
import { FBTooltip } from "../../form.builder";
import Colors from "../../layout/theme/utils/colors";

interface Props {
  sidebarList: SidebarTypes[];
  setOpen: (value: boolean) => void;
  isDrawerOpen: boolean;
  fromEdit?: boolean;
}

const StyledTooltip = (props: TooltipProps) => {
  const classes = tooltipStyles();
  return <FBTooltip arrow placement="left" classes={classes} {...props} />;
};

const Sidebar: React.FunctionComponent<Props> = ({
  sidebarList,
  isDrawerOpen,
  setOpen,
  fromEdit,
}) => {
  const [tab, setTab] = useState(0);
  const crClasses = CRStyles(isDrawerOpen);

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
          <StyledTooltip
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
          </StyledTooltip>
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
        <SidebarContainer {...{ isDrawerOpen, setOpen, sidebarList, setTab }} />
      </SMBox>
    </Box>
  );
};

(Sidebar);
