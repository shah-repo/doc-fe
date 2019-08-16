import { withStyles, WithStyles } from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { AsyncState } from "../../../state/types";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import SubmitButton from "../../components/forms/SubmitButton";
import styles from "./LoginForm.styles";

interface Props extends WithStyles<typeof styles> {
  asyncState: AsyncState;
}

const LoginFormPresenter: React.FunctionComponent<Props> = ({ classes, asyncState }) => {
  return (
    <Form>
      <FormMessage asyncState={asyncState} className={classes.status} />
      <InputField
        name="email"
        label="login.email"
        size="sm"
        inputProps={{ autoComplete: "email", autoFocus: true, id: "email" }}
        validate={validator(required, email)}
      />
      <InputField
        name="password"
        label="login.password"
        size="sm"
        inputProps={{ autoComplete: "current-password", id: "password", type: "password" }}
        validate={validator(required)}
      />
      <SubmitButton asyncState={asyncState} label="login.button" className={classes.submit} />
    </Form>
  );
};

export default withStyles(styles)(LoginFormPresenter);
