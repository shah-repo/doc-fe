import { Box, Grid, IconButton, Slide, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { ReactComponent as SidebarCloseIcon } from "../../../assets/images/move-down.svg";
import { ReactComponent as SidebarOpenIcon } from "../../../assets/images/move-up.svg";
import Text from "../../components/Text";
import styles from "../styles";
import { Sidebar } from "./types";

interface Props {
  sidebar: any;
  changeSize: () => void;
  indexNumber: number;
  sidebarList: Sidebar[];
  inputRef: React.MutableRefObject<null>;
  setIndex: (index: number) => void;
}

export type SidebarPresenterProps = Props & WithStyles<typeof styles>;

export const SidebarPresenter: React.FunctionComponent<SidebarPresenterProps> = ({
  classes,
  sidebar,
  changeSize,
  indexNumber,
  sidebarList,
  inputRef,
  setIndex,
}) => (
  <Grid item={true} xs={sidebar ? 3 : 1} style={{ position: "sticky", paddingLeft: 4, marginTop: "-40px", background: "white", height: "100%" }}>
    <Grid container={true} style={{ height: "100%" }}>
      <Grid item={true} xs={1}
        style={{
          borderRight: sidebar ? "2px solid lightgray" : "none",
          position: "fixed",
          height: "100%",
          paddingLeft: sidebar ? "none" : 4,
          paddingTop: sidebar ? "none" : 16,
          background: "white",
        }}>
        <Box borderBottom="1px solid lightgray" width="max-content" marginRight={1} >
          <IconButton onClick={() => changeSize()} className={classes.openButton}>
            {sidebar ? <SidebarOpenIcon /> : <SidebarCloseIcon />}
          </IconButton>
        </Box>
        {sidebarList.map((item, index) =>
          <Box key={item.details.title}>
            <IconButton
              ref={sidebarList[indexNumber].details.title === item.details.title ? inputRef : null}
              onClick={() => setIndex(index)}
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
            marginLeft: 78,
          }}>
          <Box padding={2} paddingLeft={2} className={classes.sidebarItemTitle}>
            <Typography variant="button">
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

export default withStyles(styles)(SidebarPresenter);
