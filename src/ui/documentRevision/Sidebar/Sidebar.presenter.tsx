import { Box, Grid, IconButton, Slide, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as SidebarCloseIcon } from "../../../assets/images/move-down.svg";
import { ReactComponent as SidebarOpenIcon } from "../../../assets/images/move-up.svg";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import styles from "../styles";
import { Sidebar } from "./types";

interface Props {
  sidebar: any;
  changeSize: () => void;
  indexNumber: number;
  sidebarList: Sidebar[];
  inputRef: React.MutableRefObject<null>;
  setIndex: (index: number) => void;
  handleMenuIconClick: (index: number) => void;
}

export const SidebarPresenter: React.FunctionComponent<Props> = ({
  sidebar,
  changeSize,
  indexNumber,
  sidebarList,
  inputRef,
  setIndex,
  handleMenuIconClick,
}) => {
  const classes = styles();

  return (
    <Grid item={true} xs={sidebar ? 3 : 1} style={{ position: "sticky" }}>
      <Grid container={true} style={{ height: "100%" }}>
        <Grid item={true} xs={1}
          style={{
            borderRight: sidebar ? `1px solid ${Colors.hint_gray}` : "none",
            position: "fixed",
            height: "100%",
            background: "white",
            right: sidebar ? "unset" : 0,
            textAlign: "center",
          }}>
          <Box>
            <IconButton onClick={() => changeSize()} className={classes.openButton}>
              {sidebar ? <SidebarOpenIcon /> : <SidebarCloseIcon />}
            </IconButton>
            <hr className={classes.border}/>
          </Box>
          {sidebarList.map((item, index) =>
            <Box key={item.details.title}>
              <IconButton
                ref={sidebarList[indexNumber].details.title === item.details.title ? inputRef : null}
                onClick={() => handleMenuIconClick(index)}
                className={classes.iconButton}
              >
                {item.icon}
              </IconButton>
            </Box>
          )}
        </Grid>
        <Slide direction="up" in={sidebar} mountOnEnter unmountOnExit>
          <Grid
            item={true}
            xs={11}
            style={{
              display: sidebar ? "block" : "none",
              padding: 0,
              width: 260,
              position: "fixed",
              marginLeft: 68,
            }}>
            <Box padding={2} paddingLeft={2} className={classes.sidebarItemTitle}>
              <Typography variant="h6">
                <Text message={sidebarList[indexNumber].details.title} />
              </Typography>
            </Box>
            <Box top={60} position="absolute" width={260} className={classes.sidebarContent}>
              {sidebarList[indexNumber].details.component}
            </Box>
          </Grid>
        </Slide>
      </Grid>
    </Grid>
  );
};

export default SidebarPresenter;
