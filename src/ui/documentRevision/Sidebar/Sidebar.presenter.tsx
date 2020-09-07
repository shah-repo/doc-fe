import { Box, Divider, Drawer, IconButton, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { ReactComponent as SidebarCloseIcon } from "../../../assets/images/move-down.svg";
import { ReactComponent as SidebarOpenIcon } from "../../../assets/images/move-up.svg";
import Text from "../../components/Text";
import styles from "./styles";
import { Sidebar } from "./types";

interface Props {
  isDrawerOpen: boolean;
  indexNumber: number;
  sidebarList: Sidebar[];
  inputRef: React.MutableRefObject<null>;
  setIndex: (index: number) => void;
  handleMenuIconClick: (index: number) => void;
  onDrawerToggle: () => void;
}

export const SidebarPresenter: React.FunctionComponent<Props> = ({
  isDrawerOpen,
  indexNumber,
  sidebarList,
  inputRef,
  handleMenuIconClick,
  onDrawerToggle,
}) => {
  const classes = styles();

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classNames(
          classes.drawerPaper,
          !isDrawerOpen && classes.drawerPaperClose
        ),
      }}
      anchor="right"
      open={isDrawerOpen}
    >
      <div className={classes.drawerInner}>
        <div className={classes.drawerHeader} />
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={onDrawerToggle}
          className={classes.menuIcon}
          disableFocusRipple={true}
          disableRipple={true}
        >
          {isDrawerOpen ? <SidebarOpenIcon /> : <SidebarCloseIcon />}
        </IconButton>
        <Divider />
        {sidebarList.map((item, index) =>
          <Box key={item.details.title}>
            <IconButton
              data-cy={item.details.dataCy !== undefined ? item.details.dataCy : "sss"}
              ref={sidebarList[indexNumber].details.title === item.details.title ? inputRef : null}
              onClick={() => handleMenuIconClick(index)}
              className={classes.iconButton}
            >
              {item.icon}
            </IconButton>
          </Box>
        )}
        <div
          style={{
            display: isDrawerOpen ? "block" : "none",
            padding: 0,
            position: "fixed",
            marginLeft: 65,
            height: "calc(100% - 105px)",
            width: "253px",
          }}>
          <Box mt={2}>
            <Typography variant="h6">
              <Text message={sidebarList[indexNumber].details.title} />
            </Typography>
          </Box>
          <Box mt={2.5} className={classes.sidebarList}>
            {sidebarList[indexNumber].details.component}
          </Box>
        </div>
      </div>
    </Drawer>
  );
};

export default SidebarPresenter;
