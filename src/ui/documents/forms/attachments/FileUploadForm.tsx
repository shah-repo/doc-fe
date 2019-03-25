import { Button, withStyles, WithStyles } from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../../state/types";
import FileField from "../../../components/forms/fields/File";
import { required, validator } from "../../../components/forms/fields/validators";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import styles from "./FileUploadForm.styles";

interface Props extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  cancel: () => void;
}

const FileUploadForm: React.FunctionComponent<Props> = ({ cancel, classes, asyncState }) => {
  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      <FileField name="file" validate={validator(required)} />
      <FormProgress asyncState={asyncState} />
      <SubmitButton
        asyncState={asyncState}
        label="document.file.upload"
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
        <Text translation="document.file.cancel" />
      </Button>
    </Form>
  );
};

export default withStyles(styles)(FileUploadForm);
