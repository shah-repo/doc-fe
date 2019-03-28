import { Button, withStyles, WithStyles } from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../state/types";
import InputField from "../../components/forms/fields/Input";
import { required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import styles from "./PasswordForm.styles";

interface PasswordFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  cancel: () => void;
}

const PasswordForm: React.FunctionComponent<PasswordFormProps> = ({ cancel, classes, asyncState }) => {
  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      <InputField
        name="password"
        label="document.action.password"
        inputProps={{ type: "password" }}
        validate={validator(required)}
      />
      <FormProgress asyncState={asyncState} />
      <SubmitButton
        asyncState={asyncState}
        label="document.action.confirm"
        fullWidth={false}
        className={classes.submitButton}
      />
      <Button
        variant="text"
        color="secondary"
        className={classes.cancelButton}
        disabled={asyncState.status === AsyncStatus.Active}
        onClick={cancel}
      >
        <Text translation="document.action.cancel" />
      </Button>
    </Form>
  );
};

export default withStyles(styles)(PasswordForm);
