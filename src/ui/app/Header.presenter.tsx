import { Box, FormControlLabel, Grid, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { SM } from "../../App";
import EnlilLogo from "../../assets/images/enlil_logo.svg";
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
    return  (
      <Box
        height={40}
        fontSize="1rem"
        style={{
          background: "linear-gradient(262.45deg, #01A6C7 0.28%, #4C69FF 16.91%, #011FBB 85.48%)",
        }}
      >
        <Box
          height="100%"
          width={150}
          mr="18%"
          style={{
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${EnlilLogo})`,
            float: "right",
          }}
        />
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
          <AutosaveToggle/>
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
          {canToggleCustomLabels &&
        <FormControlLabel
          control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
          label="Show customizable labels"
        />
          }
          <AutosaveToggle/>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(Header);
