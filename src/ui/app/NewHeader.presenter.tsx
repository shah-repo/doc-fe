import { FormControlLabel, Grid, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Text from "../components/Text";
import Colors from "../layout/theme/utils/colors";
import AutosaveToggle from "./autosave/autosave";
import styles from "./NewHeader.styles";

interface Props extends WithStyles<typeof styles> {
  name: string;
  toggleCustomLabels: () => void;
  customLabelsValue: boolean;
  canToggleCustomLabels: boolean;
}
const style = {
  color: Colors.white,
  fontSize: "12px",
};

const Header: React.FunctionComponent<Props> = ({
  classes,
  name,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
}) => (
  <AppBar position="fixed" color="primary" className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <div className={classes.logo}></div>
      <Grid
        container={true}
        wrap="nowrap"
        justify="space-between"
        alignContent="center"
      >
        <Grid item={true} zeroMinWidth>
          <Typography noWrap className={classes.toolbarTitle}>
            <Text translation="header.welcome.back" />
            ,&nbsp;
            <b className={classes.toolbarTitleName}>{name}!</b>
          </Typography>
        </Grid>
        <Grid
          item={true}
          className={classes.wrapContainer}
        >
          <Box alignItems="center">
            {canToggleCustomLabels && (
              <FormControlLabel
                control={
                  <Switch
                    name="toggleCustomLabels"
                    checked={customLabelsValue}
                    onChange={toggleCustomLabels}
                  />
                }
                label="Show customizable labels"
                style={style}
              />
            )}
            {/* Autosave disable changes  */}
            <AutosaveToggle/>
          </Box>
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);
