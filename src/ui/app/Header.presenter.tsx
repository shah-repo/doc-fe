import { Box, FormControlLabel, Grid, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import SM from "../../App/Shifamed/Utils/SM/SM";
import Text from "../components/Text";
import AutosaveToggle from "./autosave/autosave";
import styles from "./Header.styles";

interface Props extends WithStyles<typeof styles> {
  toggleCustomLabels: () => void;
  customLabelsValue: boolean;
  canToggleCustomLabels: boolean;
}


const Header: React.FunctionComponent<Props> = ({
  classes,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
}) => {

  if (SM.isNewLayout) {
    return (
      <Box
        height={48}
        className={classes.newAppBar}
        display="flex"
        alignContent="center"
        alignItems="center"
      >
        {<Box className={classes.newLogo} />}
        <Grid container={true} alignItems="flex-end" justify="flex-end">
          <Grid item>
            {canToggleCustomLabels && (
              <FormControlLabel
                control={
                  <Switch
                    name="toggleCustomLabels"
                    checked={customLabelsValue}
                    onChange={toggleCustomLabels}
                  />
                }
                label={
                  <Text translation="form.builder.header.control.label" />
                }
              />
            )}
          </Grid>
          <Grid item>
            <AutosaveToggle />
          </Grid>
        </Grid>
      </Box>
    );
  }
  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logo}></div>
        <Grid
          container={true}
          alignItems="flex-end"
          justify="flex-end"
        >
          {canToggleCustomLabels && (
            <FormControlLabel
              control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
              label={<Text translation="form.builder.header.control.label" />}
            />
          )}
          <AutosaveToggle />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(Header);
