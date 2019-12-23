import {
  withStyles,
  WithStyles,
} from "@material-ui/core";
import * as React from "react";
import { SIGNUP_URL } from "../constants/urls";
import LoginFormContainer from "./forms/LoginForm.container";
import styles from "./Login.styles";

interface Props {
  logo: string;
}

type LoginPresenterProps = WithStyles<typeof styles> & Props;

const LoginPresenter: React.FunctionComponent<LoginPresenterProps> = ({ classes, logo }) => (
  <LoginFormContainer
    signMessage="login.message"
    signLabel="login.create.account"
    route={SIGNUP_URL}
    title="login.title"
  />
);

export default withStyles(styles)(LoginPresenter);
