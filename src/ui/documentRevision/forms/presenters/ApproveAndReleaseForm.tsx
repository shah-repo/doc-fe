import { Button } from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../../state/types";
import Approvers from "../../../change.request/form/approvers";
import InputField from "../../../components/forms/fields/Input";
import { required, validator } from "../../../components/forms/fields/validators";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import { styles } from "./ApproveAndRelease.styles";

interface Props {
  asyncState: AsyncState;
  cancel: () => void;
}

const ApproveAndReleaseForm: React.FunctionComponent<Props> = ({ cancel, asyncState }) => {
  const classes = styles();

  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      <Approvers />
      <InputField
        name="password"
        label="transition.action.password"
        inputProps={{ type: "password" }}
        validate={validator(required)}
      />
      <FormProgress asyncState={asyncState} />
      <SubmitButton
        asyncState={asyncState}
        label="transition.action.confirm"
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
        <Text translation="transition.action.cancel" />
      </Button>
    </Form>
  );
};

export default ApproveAndReleaseForm;
