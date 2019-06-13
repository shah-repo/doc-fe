import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link } from "react-router-dom";
import Text from "../components/Text";
import { HOME_URL } from "../constants/urls";
import styles from "./Header.styles";

interface Props extends WithStyles<typeof styles> {
  email: string;
  name: string;
  onLogout: () => void;
}

const Header: React.FunctionComponent<Props> = ({ classes, onLogout, name }) => (
  <AppBar position="static" color="primary" className={classes.appBar}>
    <Toolbar>
      <Typography variant="h6" noWrap={true} className={classes.toolbarTitle}>
        <Link to={HOME_URL} className={classes.headerLink}>
          <Text translation="header.title" />
        </Link>
      </Typography>
      <Typography variant="caption" color="inherit" noWrap={true}>
        <Text translation="header.welcome" values={{ name }} />
      </Typography>
      <Button color="secondary" variant="text" onClick={onLogout}>
        <Text translation="header.logout" />
      </Button>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);
