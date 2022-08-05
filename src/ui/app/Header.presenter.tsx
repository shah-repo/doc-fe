import { FormControlLabel, Grid, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
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
}) => (
  <AppBar className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <Grid
        container={true}
        alignItems="flex-end"
        justify="flex-end"
        wrap="nowrap"
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

export default withStyles(styles)(Header);
