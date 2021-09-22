import { Button, withStyles, WithStyles } from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../../state/types";
import InputField from "../../forms/fields/Input";
import { required, validator } from "../../forms/fields/validators";
import FormMessage from "../../forms/FormMessage";
import FormProgress from "../../forms/FormProgress";
import SubmitButton from "../../forms/SubmitButton";
import Text from "../../Text";
import styles from "./PasswordForm.styles";

interface PasswordFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  cancel: () => void;
}

const PasswordForm: React.FunctionComponent<PasswordFormProps> = ({ cancel, classes, asyncState }) => (
  <Form className={classes.form}>
    <FormMessage asyncState={asyncState} />
    <InputField
      name="password"
      label="transition.action.password"
      dataCy="transition.action.password"
      inputProps={{ type: "password" }}
      validate={validator(required)}
    />
    <FormProgress asyncState={asyncState} />
    <SubmitButton
      id="passwordConfirm"
      dataCy="passwordConfirm"
      asyncState={asyncState}
      label="transition.action.confirm"
      fullWidth={false}
      className={classes.submitButton}
    />
    <Button
      variant="text"
      color="secondary"
      data-cy="reject.request"
      className={classes.cancelButton}
      disabled={asyncState.status === AsyncStatus.Active}
      onClick={cancel}
    >
      <Text translation="transition.action.cancel" />
    </Button>
  </Form>
);

export default withStyles(styles)(PasswordForm);
