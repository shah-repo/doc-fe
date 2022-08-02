import { Box, FormControlLabel, Grid, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import HelpCenter from "../../App/Enlil/Features/HelpCenter/HelpCenter";
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

  if (SM.isNewLayout || SM.isNewCRLayout) {
    return (
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={`${classes.toolbar} formBuilder`}>
          {<Box className={classes.newLogo} />}
          <Grid container={true} alignItems="center" justify="flex-end">
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
            <Grid item>
              <HelpCenter />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logo}></div>
        <Grid
          container={true}
          alignItems="center"
          justify="flex-end"
        >
          {canToggleCustomLabels && (
            <FormControlLabel
              control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
              label={<Text translation="form.builder.header.control.label" />}
            />
          )}
          <AutosaveToggle />
          <HelpCenter />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(Header);
