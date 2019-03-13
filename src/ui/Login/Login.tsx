import {
  Avatar,
  Paper,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import * as React from "react";
import Message from "../components/Message";
import styles from "./Login.styles";
import LoginForm from "./LoginForm";

type Props = WithStyles<typeof styles>;

const Login: React.FunctionComponent<Props> = ({ classes }) => (
  <div className={classes.root}>
    <Paper className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        <Message id="login.title" />
      </Typography>
      <LoginForm />
    </Paper>
  </div>
);

export default withStyles(styles)(Login);
