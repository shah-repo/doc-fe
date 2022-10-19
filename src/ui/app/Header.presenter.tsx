import { FormControlLabel, Grid, Switch, Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import HelpCenter from "../../App/Enlil/Features/HelpCenter/HelpCenter";
import Text from "../components/Text";
import AutosaveToggle from "./autosave/autosave";
import styles from "./Header.styles";

export interface HeaderPresenterProps {
  name: string;
  fullHeight?: boolean;
  toggleCustomLabels: () => void;
  customLabelsValue: boolean;
  canToggleCustomLabels: boolean;
}

const Header: React.FunctionComponent<HeaderPresenterProps & WithStyles<typeof styles>> = ({
  classes,
  name,
  fullHeight,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
}) => (
  <AppBar className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <Grid container alignItems="center" justify="flex-end" wrap="nowrap">
        {fullHeight && (
          <Typography variant="caption" className={classes.welcomeText}>
            <Text translation="header.welcome.back" />,
            {" "}
            <b className={classes.welcomeTextName}>{name}!</b>
          </Typography>
        )}
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

export default withStyles(styles)(Header);
