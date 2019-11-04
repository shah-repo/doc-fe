import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Text from "../components/Text";
import { Translation } from "../translations/types";
import styles from "./Header.styles";

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
      <Grid
        container={true}
        spacing={10}
        justify="space-between"
        alignItems="center">
        <Grid item={true} xs={6}>
          {pageTitle !== "translation.unknown" ? (
            <Typography variant="h6">
              <Text translation={pageTitle} />
            </Typography>
          ) : null}
        </Grid>
        <Grid item={true} xs={6}>
          <Grid container={true} justify="flex-end" alignItems="center">
            <Typography variant="caption" className={classes.welcomeText} noWrap={true}>
              <Text translation="header.welcome" />,
            </Typography>
            &nbsp;
            <Typography variant="caption" className={classes.name} noWrap={true}>
              <Text translation="header.name" values={{ name }} />
            </Typography>
            <Button color="primary" variant="text" onClick={onLogout}>
              <Text translation="header.logout" />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);
