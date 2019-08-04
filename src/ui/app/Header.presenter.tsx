import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Text from "../components/Text";
import { Translation } from "../translations/types";
import styles from "./Header.styles";
import { Grid } from "@material-ui/core";

interface Props extends WithStyles<typeof styles> {
  email: string;
  name: string;
  pageTitle: Translation;
  onLogout: () => void;
}

const Header: React.FunctionComponent<Props> = ({
  classes,
  onLogout,
  name,
  pageTitle,
}) => (
  <AppBar position="fixed" color="primary" className={classes.appBar}>
    <Toolbar>
      <Grid container spacing={10} justify="space-between">
        <Grid item xs={6}>
          {pageTitle !== "translation.unknown" ? (
            <Typography variant="h6">
              <Text translation={pageTitle} />
            </Typography>
          ) : null}
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="flex-end" alignItems="center">
            <Typography variant="caption" color="secondary" noWrap={true}>
              <Text translation="header.welcome" values={{ name }} />
            </Typography>
            <Button color="secondary" variant="text" onClick={onLogout}>
              <Text translation="header.logout" />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);
