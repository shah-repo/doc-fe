import { Paper, Typography } from "@material-ui/core";
import * as React from "react";
import { NavLink } from "react-router-dom";
import Text from "../../components/Text";
import { styles } from "./SignUp.styles";

interface Props {
  email: string;
  logo: string;
  message?: any;
  isForgotPassword: boolean;
}

const VerificationEmailPage: React.FunctionComponent<Props> = ({ email, logo, message, isForgotPassword }) => {
  const classes = styles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <img
          src={logo}
          alt="Logo"
          className={classes.logo}
        />
        <Typography id="VerificationEmailPage-title" variant="h4" className={classes.title}>
          <Text translation={"signup.verification"} />
        </Typography>
        <Typography id="VerificationEmailPage-email" variant="h4" className={classes.boldTitle}>
          {`"${email}"`}
        </Typography>
        <Typography id="VerificationEmailPage-message" variant="subtitle1" className={classes.title}>
        <Text translation={message} />
        </Typography>
        {!isForgotPassword &&
        <NavLink to={"/login"} exact={true} className={classes.navigationLink} id="VerificationEmailPage-loginLink">
          <Text translation={"signup.close.window"} />
        </NavLink>}
      </Paper>
    </div>
  );
};

export default VerificationEmailPage;
