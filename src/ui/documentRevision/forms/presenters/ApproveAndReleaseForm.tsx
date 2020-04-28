import { Button } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import * as React from "react";
import { Group } from "../../../../state/ducks/auth/types";
import { AsyncState, AsyncStatus } from "../../../../state/types";
import Approvers from "../../../change.request/form/approvers";
import InputField from "../../../components/forms/fields/Input";
import { required, validator } from "../../../components/forms/fields/validators";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import { ApproveAndReleaseFormValues } from "../types";
import { styles } from "./ApproveAndRelease.styles";

interface Props extends FormikProps<ApproveAndReleaseFormValues>{
  asyncState: AsyncState;
  cancel: () => void;
  isQms: boolean;
  documentTypeGroups: Group[];
}

const ApproveAndReleaseForm: React.FunctionComponent<Props> = ({
  cancel,
  asyncState,
  isQms,
  values,
  documentTypeGroups,
}) => {
  const classes = styles();

  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      {isQms && <Approvers withoutCurrentUser={true} values={values} documentTypeGroups={documentTypeGroups} />}
      {isQms && <InputField
        name="password"
        label="transition.action.password"
        inputProps={{ type: "password" }}
        validate={validator(required)}
      />}
      <FormProgress asyncState={asyncState} />
      <SubmitButton
        asyncState={asyncState}
        label="transition.action.confirm"
        fullWidth={false}
        className={classes.submitButton}
        id="ApproveAndRelease-submit"
      />
      <Button
        variant="text"
        color="secondary"
        className={classes.cancelButton}
        disabled={asyncState.status === AsyncStatus.Active}
        onClick={cancel}
        id="ApproveAndRelease-cancelButton"
      >
        <Text translation="transition.action.cancel" />
      </Button>
    </Form>
  );
};

export default ApproveAndReleaseForm;
