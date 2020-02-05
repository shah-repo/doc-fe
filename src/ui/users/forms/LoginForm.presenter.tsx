import { Button, Paper, Typography, withStyles, WithStyles } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { AsyncState } from "../../../state/types";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";
import { LoginFormValues } from "../types";
import styles from "./LoginForm.styles";

interface Props extends WithStyles<typeof styles>, FormikProps<LoginFormValues> {
  asyncState: AsyncState;
  signMessage: Translation;
  signLabel: Translation;
  route: string;
  title: Translation;
  logo: string;
  forgotPassword?: () => void;
  buttonLabel: Translation;
}

const LoginFormPresenter: React.FunctionComponent<Props> = ({
  classes,
  asyncState,
  signMessage,
  route,
  signLabel,
  buttonLabel,
  title,
  logo,
  forgotPassword,
}) => {
  return (
    <Paper className={classes.paper}>
      <img
        src={logo}
        alt="Logo"
        className={classes.logo}
      />
      <Typography variant="h4" className={classes.title}>
        <Text translation={title} />
      </Typography>
      <Form className={classes.formStyle}>
      <FormMessage asyncState={asyncState} className={classes.status} />
      <InputField
        name="email"
        label="login.email"
        size="sm"
        gutter={false}
        inputProps={{ autoComplete: "email", autoFocus: true, id: "LoginFormPresenter-email" }}
        validate={validator(required, email)}
        lpignore={false}
      />
      <div className={classes.passwordContainer}>
        {signLabel !== "signup.sign.in" &&
        <Button color="primary" onClick={forgotPassword} className={classes.forgotPasswordLink} id="LoginFormPresenter-forgotLink">
          <Text translation={"forgot.password"} />
        </Button>}
      <InputField
        name="password"
        label="login.password"
        size="sm"
        gutter={false}
        inputProps={{ autoComplete: "current-password", id: "LoginFormPresenter-password", type: "password" }}
        validate={validator(required)}
        lpignore={false}
      /></div>
        <SubmitButton
          asyncState={asyncState}
          label={buttonLabel}
          className={classes.submit}
          id="LoginFormPresenter-submit"
        />
      <Typography component="h1" variant="h5" className={classes.navigationText}>
        <Text translation={signMessage} />
        <NavLink to={route} exact={true} className={classes.navigationLink} id="LoginFormPresenter-linkRoute">
          <Text translation={signLabel} />
        </NavLink>
      </Typography>
    </Form>
    </Paper>
  );
};

export default withStyles(styles)(LoginFormPresenter);
