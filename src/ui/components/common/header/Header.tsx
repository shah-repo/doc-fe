import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { SM } from "../../../../App";
import { DRAWER_WIDTH } from "../../../app/NavigationLink.styles";
import Colors from "../../../layout/theme/utils/colors";

const styles = makeStyles((theme: Theme) =>
  createStyles({
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

const Header: React.FunctionComponent = ({ children }) => {
  const classes = styles();

  if (SM.isNewLayout) {
    return (
      <Box
        minHeight={60}
        borderTop={1}
        borderColor={Colors.medium_gray}
        bgcolor="white"
        py={1}
        px={2}
      >
        <Grid container={true}>
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
