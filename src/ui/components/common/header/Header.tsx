import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { SM } from "../../../../App";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";
import { DRAWER_WIDTH } from "../../../app/NavigationLink.styles";
import Colors from "../../../layout/theme/utils/colors";
import { statusClassMapping } from "../kendo/helpers";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    headerSection: {
      height: "64px",
      borderRadius: "6px",
    },
    GREEN_STATUS: {
      background: Colors.green_blue,
    },
    PENDING_STATUS: {
      background: Colors.school_bus_yellow,
    },
    GRAY_STATUS: {
      background: Colors.mandy,
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
const Header: React.FunctionComponent<Props> = ({ children, status, displayStatus }) => {
  const classes = styles();

  const isCreateUrl = SM.pathname.includes("document_revision/create");
  if (SM.isNewLayout && !isCreateUrl) {
    return (
      <Box
        minHeight={60}
        borderColor={Colors.medium_gray}
        bgcolor="white"
        py={1}
        px={2}
        alignContent="center"
      >
        <Grid container={true} className={`${classes.headerSection} ${
          classes[statusClassMapping[displayStatus || status || ""]]
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

export default Header;
