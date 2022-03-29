import { FormControlLabel, Grid, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
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
}) => (
  <AppBar position="fixed" color="primary" className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <div className={classes.logo}></div>
      <Grid
        container={true}
        alignItems="flex-end"
        justify="flex-end"
      >
        {canToggleCustomLabels &&
        <FormControlLabel
          control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
          label="Show customizable labels"
        />
        }
      </Grid>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);
