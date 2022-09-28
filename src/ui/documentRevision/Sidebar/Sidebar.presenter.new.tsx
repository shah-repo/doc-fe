import { Box, CircularProgress, Divider, Drawer, IconButton, TooltipProps, Typography } from "@material-ui/core";
import classNames from "classnames";
import { useObserver } from "mobx-react";
import React from "react";
import { SM } from "../../../App";
import { tooltipStyles } from "../../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.new.styles";
import { ReactComponent as SidebarCloseIcon } from "../../../assets/images/move-down.svg";
import { ReactComponent as SidebarOpenIcon } from "../../../assets/images/move-up.svg";
import Text from "../../components/Text";
import { FB, FBTooltip } from "../../form.builder";
import styles from "./styles.new";
import { Sidebar } from "./types.new";

interface Props {
  isDrawerOpen: boolean;
  indexNumber: number;
  sidebarList: Sidebar[];
  inputRef: React.MutableRefObject<null>;
  handleMenuIconClick: (index: number) => void;
  onDrawerToggle: () => void;
  loading?: boolean;
}

const StyledTooltip = (props: TooltipProps) => {
  const classes = tooltipStyles();
  return <FBTooltip arrow placement="left" classes={classes} {...props} />;
};

const SidebarPresenter: React.FunctionComponent<Props> = ({
  isDrawerOpen,
  indexNumber,
  sidebarList,
  inputRef,
  handleMenuIconClick,
  onDrawerToggle,
  loading,
}) => {
  const classes = styles();
  const { bookmarkState } = FB.useStores();
  const { _documentRevisionSidebarState } = SM.useStores();

  _documentRevisionSidebarState?.setTitle(sidebarList[indexNumber].details.title);

  useObserver(() => {
    loading = bookmarkState?.loading;
  });

  if (SM.isNewLayout || SM.isNewCRLayout) {
    return (
      <Box display="flex" height="100%">
        <Box width={48} textAlign="center" style={{ borderRight: "1px solid rgb(212, 219, 225)" }}>
          {sidebarList.map((item, index) =>
            item.details.shouldShow && (
              <Box key={item.details.title}>
                <StyledTooltip title={item.details.title}>
                  <IconButton
                    data-cy={item.details.dataCy !== undefined ?
                      item.details.dataCy : `${item.type}-icon`}
                    ref={sidebarList[indexNumber].details.title === item.details.title ? inputRef : null}
                    onClick={() => handleMenuIconClick(index)}
                    className={classNames(classes.iconButtonNew, { [classes.bgIsActiveTab]: indexNumber === index })}>
                    {(!loading || item.type !== "bookmarks") && item.icon}
                    {item.type === "bookmarks" && loading && <CircularProgress size={18} />}
                  </IconButton>
                </StyledTooltip>
              </Box>
            )
          )}
        </Box>
        <Box data-cy={`${sidebarList[indexNumber].details.title}-detail`}
          width={233} display="flex" flexGrow={1} height="calc(100vh - 180px)"
          className={classNames(classes.references, "containing-box-scrollbar")}>
          {sidebarList[indexNumber].details.component}
        </Box>
      </Box>
    );
  }

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
          item.details.shouldShow && <Box key={item.details.title}>
            <IconButton
              data-cy={item.details.dataCy !== undefined ? item.details.dataCy : `${item.type}-icon`}
              ref={sidebarList[indexNumber].details.title === item.details.title ? inputRef : null}
              onClick={() => handleMenuIconClick(index)}
              className={classes.iconButton}
            >
              {(!loading || item.type !== "bookmarks") && item.icon}
              {item.type === "bookmarks" && loading && <CircularProgress size={18} />}
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
          <Box mt={2.25} ml={1}>
            <Typography variant="button">
              <Text message={(sidebarList[indexNumber].details.title)} />
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
