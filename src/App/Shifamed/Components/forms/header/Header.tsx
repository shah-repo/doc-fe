import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { SM } from "../../../..";
import { DocumentRevisionStatus } from "../../../../../state/ducks/documentRevisions/types";
import { DRAWER_WIDTH } from "../../../../../ui/app/NavigationLink.styles";
import { FormHeaderStatusClassMapping } from "../../../../../ui/components/common/kendo/helpers";
import Colors from "../../../../../ui/layout/theme/utils/colors";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    headerSection: {
      minHeight: "64px",
      borderRadius: "6px",
    },
    GREEN_STATUS: {
      background: Colors.green_blue,
    },
    RED_STATUS: {
      background: Colors.latest_red_varient,
    },
    CLOSED_STATUS: {
      background: Colors.dawn,
    },
    PENDING_STATUS: {
      background: Colors.school_bus_yellow,
    },
    GRAY_STATUS: {
      background: Colors.mandy,
    },
    WIP_STATUS: {
      background: Colors.raven,
    },
    undefined: {
      background: Colors.dodger_blue,
    },
    appbar: {
      backgroundColor: Colors.white,
      position: "fixed",
      top: "45px",
      zIndex: theme.zIndex.drawer + 1,
    },
    toolbar: {
      marginLeft: DRAWER_WIDTH,
      borderBottom: `1px solid ${Colors.medium_gray}`,
      minHeight: "60px",
    },
  },
  ));
interface Props{
  status?: DocumentRevisionStatus;
  displayStatus?: DocumentRevisionStatus;
}
const NewHeader: React.FunctionComponent<Props> = ({ children, status, displayStatus }) => {
  const classes = styles();

  const isCreateUrl = SM.pathname.includes("document_revision/create");
  if (!isCreateUrl) {
    return (
      <Box
        minHeight={60}
        borderColor={Colors.medium_gray}
        bgcolor="white"
        py={1}
        px={2}
        alignContent="center"
        alignItems="center"
      >
        <Grid container={true} className={`${classes.headerSection} ${
          classes[FormHeaderStatusClassMapping[displayStatus || status || ""]]
        }`} alignItems="center">
          {children}
        </Grid>
      </Box>
    );
  }

  return (
    <AppBar color="primary" className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <Grid container={true}>
          {children}
        </Grid>
      </Toolbar>
    </AppBar>
  ); };

export default NewHeader;
