import { createStyles, Grid, makeStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { DRAWER_WIDTH } from "../../app/NavigationLink.styles";

export const styles = makeStyles(() =>
  createStyles({
    appbar: {
      backgroundColor: "#fff",
    },
    toolbar: {
      marginLeft: DRAWER_WIDTH,
      borderBottom: `1px solid ${"#D4DBE1"}`,
    },
  },
  ));

const Header: React.FunctionComponent = ({ children }) => {
  const classes = styles();

  return (
    <AppBar position="fixed" color="primary" className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <Grid container={true}>
          {children}
        </Grid>
      </Toolbar>
    </AppBar>
  ); };

export default Header;
