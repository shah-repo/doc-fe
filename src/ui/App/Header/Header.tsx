import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Message from "../../components/Message";
import styles from "./Header.styles";

interface Props extends WithStyles<typeof styles> {
  email: string;
  onLogout: () => void;
}

const Header: React.FunctionComponent<Props> = ({ classes, onLogout, email }) => (
  <AppBar position="static" color="default" className={classes.appBar}>
    <Toolbar>
      <Typography variant="h6" color="inherit" noWrap={true} className={classes.toolbarTitle}>
        <Message id="header.title" />
      </Typography>
      <Typography variant="caption" color="inherit" noWrap={true}>
        <Message id="header.welcome" values={{ email }} />
      </Typography>
      <Button color="secondary" variant="text" onClick={onLogout}>
        <Message id="header.logout" />
      </Button>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);
