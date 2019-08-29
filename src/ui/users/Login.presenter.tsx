import {
  Avatar,
  Paper,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import * as React from "react";
import Text from "../components/Text";
import LoginFormContainer from "./forms/LoginForm.container";
import styles from "./Login.styles";

type Props = WithStyles<typeof styles>;

const LoginPresenter: React.FunctionComponent<Props> = ({ classes }) => (
  <div className={classes.root}>
    <Paper className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        <Text translation="login.title" />
      </Typography>
      <LoginFormContainer />
    </Paper>
  </div>
);

export default withStyles(styles)(LoginPresenter);
