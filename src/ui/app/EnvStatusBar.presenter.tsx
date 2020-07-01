import { withStyles, WithStyles } from "@material-ui/core/styles";
import { default as React } from "react";
import styles from "./EnvStatusBar.styles";

interface Props extends WithStyles<typeof styles> {
  isSandbox: boolean;
}

const EnvStatusBarPresenter: React.FunctionComponent<Props> = ({
  classes,
  isSandbox,
}) => {
  if (!isSandbox) {
    return null;
  }
  return (
    <div className={classes.box}>
      Sandbox
    </div>
  );
};

export default withStyles(styles)(EnvStatusBarPresenter);
