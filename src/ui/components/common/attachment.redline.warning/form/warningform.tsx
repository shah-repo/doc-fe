import { Box, Button, withStyles, WithStyles } from "@material-ui/core";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { Form } from "formik";
import * as React from "react";
import { AsyncState, AsyncStatus } from "../../../../../state/types";
import { Translation } from "../../../../translations/types";
import SubmitButton from "../../../forms/SubmitButton";
import Text from "../../../Text";
import styles from "./warningform.styles";

interface RedlineWarningFormProps extends WithStyles<typeof styles> {
  asyncState: AsyncState;
  cancel: () => void;
  translationText: Translation;
  translationButtonText: string;
}

const RedlineWarningForm: React.FunctionComponent<RedlineWarningFormProps> = ({
  cancel, classes, asyncState, translationText, translationButtonText,
}) => (
  <Form className={classes.form}>
    <Box className = {classes.Box}>
      <WarningRoundedIcon fontSize="large" className={classes.icon}/>
      <h2 className={classes.h4}>Alert!</h2>
      <Text translation={translationText}/>
      <Box>
        <SubmitButton
          id="passwordConfirm"
          asyncState={asyncState}
          label= {translationButtonText}
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
