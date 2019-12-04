import { Typography, withStyles, WithStyles } from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { AsyncState } from "../../../state/types";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";
import styles from "./LoginForm.styles";

interface Props extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  buttonLabel: Translation;
  signMessage: Translation;
  signLabel: Translation;
  route: string;
}

const LoginFormPresenter: React.FunctionComponent<Props> = ({
  classes,
  asyncState,
  buttonLabel,
  signMessage,
  route,
  signLabel,
}) => {
  return (
    <Form>
      <FormMessage asyncState={asyncState} className={classes.status} />
      <InputField
        name="email"
        label="login.email"
        size="sm"
        gutter={false}
        inputProps={{ autoComplete: "email", autoFocus: true, id: "email" }}
        validate={validator(required, email)}
        lpignore={false}
      />
      <InputField
        name="password"
        label="login.password"
        size="sm"
        gutter={false}
        inputProps={{ autoComplete: "current-password", id: "password", type: "password" }}
        validate={validator(required)}
        lpignore={false}
      />
      <SubmitButton asyncState={asyncState} label={buttonLabel} className={classes.submit} />
      <Typography component="h1" variant="h5">
        <Text translation={signMessage} />
        <NavLink to={route} exact={true} className={classes.navigationLink} >
          <Text translation={signLabel} />
        </NavLink>
      </Typography>
    </Form>
  );
};

export default withStyles(styles)(LoginFormPresenter);
