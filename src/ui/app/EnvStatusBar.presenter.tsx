import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { default as React } from "react";
import styles from "./EnvStatusBar.styles";

interface Props extends WithStyles<typeof styles> {
  isSandbox: boolean;
}

const EnvStatusBarPresenter: React.FunctionComponent<Props> = ({ classes, isSandbox }) => {
  if (isSandbox) {
    return (<div className={classes.container}><AppBar position="fixed" color="primary" className={classes.appBar}>
      <Box className={classes.box}>Sandbox</Box>
    </AppBar></div>);
  } else {
    return null;
  }
};

export default withStyles(styles)(EnvStatusBarPresenter);
