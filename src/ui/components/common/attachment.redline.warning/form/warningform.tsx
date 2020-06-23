import { Button, withStyles, WithStyles, Box } from "@material-ui/core";
import { Form } from "formik";
import * as React from "react";
import styles from "./warningform.styles";
import { AsyncState, AsyncStatus } from "../../../../../state/types";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import SubmitButton from "../../../forms/SubmitButton";
import Text from "../../../Text";
import { Translation } from "../../../../translations/types";

interface RedlineWarningFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  cancel: () => void;
  translationText: Translation;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RedlineWarningForm: React.FunctionComponent<RedlineWarningFormProps> = ({ cancel, classes, asyncState, translationText}) => (
  <Form className={classes.form}>
    <Box className = {classes.Box}>
      <WarningRoundedIcon fontSize="large" className={classes.icon}/>
      <h2 className={classes.h4}>Alert!</h2>
      <Text translation={translationText}/>
      <Box>
        <SubmitButton
          id="passwordConfirm"
          asyncState={asyncState}
          label="common.attachment.redline.warning.download.label"
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
      </Box>
    </Box>
  </Form>
);

export default withStyles(styles)(RedlineWarningForm);
