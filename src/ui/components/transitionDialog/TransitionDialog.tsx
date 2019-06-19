import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Formik, FormikProps } from "formik";
import React from "react";
import { Transition } from "./types";
import { AsyncState } from "../../../state/types";
import Text from "../../components/Text";
import PasswordForm from "./passwordForm/PasswordForm";
import { PasswordFormValues } from "./types";
import styles from "./TransitionDialog.styles";

export interface TransitionDialogProps {
  onSubmit: (values: PasswordFormValues) => void;
  closeDialog: () => void;
  openDialog: () => void;
  isDialogOpen: boolean;
  asyncState: AsyncState;
  buttonProps?: ButtonProps;
  transition: Transition;
  label: string;
}

type Props = TransitionDialogProps & WithStyles<typeof styles>;

const TransitionDialog: React.FunctionComponent<Props> =
  ({ classes, onSubmit, closeDialog, openDialog, isDialogOpen, asyncState, buttonProps, transition, label }) => {
    const renderForm = (props: FormikProps<any>) => (
      <PasswordForm {...props} asyncState={asyncState} cancel={closeDialog} />
    );

    const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();

    return (
      <div className={classes.container}>
        <Button
          color="primary"
          variant="contained"
          aria-label={transition}
          className={classes.button}
          onClick={openDialog}
          {...buttonProps}
        >
          <Text message={label} />
        </Button>
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          open={isDialogOpen}
          onSubmit={preventPropagation}
        >
          <DialogTitle>
            <Text translation="transition.action.title" />
          </DialogTitle>
          <DialogContent>
            <Formik
              render={renderForm}
              initialValues={{ password: "" }}
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

export default withStyles(styles)(TransitionDialog);
