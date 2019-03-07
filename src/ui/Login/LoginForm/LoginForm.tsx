import {
  Button,
  FormHelperText,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../state/types";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";
import Message from "../../components/Message";
import styles from "./LoginForm.styles";

interface Props extends WithStyles<typeof styles> {
  asyncState: AsyncState;
}

const LoginForm: React.FunctionComponent<Props> = ({ classes, asyncState }) => {

  const MessageComponent = asyncState.message && (
    <FormHelperText className={classes.status} error={asyncState.status === AsyncStatus.Error}>
      <Message id={asyncState.message} />
    </FormHelperText>
  );

  return (
    <Form>
      {MessageComponent}
      <InputField
        name="email"
        label="login.email"
        inputProps={{ autoComplete: "email", autoFocus: true, id: "email" }}
        validate={validator(required, email)}
      />
      <InputField
        name="password"
        label="login.password"
        inputProps={{ autoComplete: "current-password", id: "password", type: "password" }}
        validate={validator(required)}
      />
      <Button
        type="submit"
        fullWidth={true}
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={asyncState.status === AsyncStatus.Active}
      >
        <Message id="login.button" />
      </Button>
    </Form>
  );
};

export default withStyles(styles)(LoginForm);
