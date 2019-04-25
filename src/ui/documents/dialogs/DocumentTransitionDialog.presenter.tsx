import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Formik, FormikActions, FormikProps } from "formik";
import React from "react";
import { DocumentTransition } from "../../../state/ducks/documents";
import { AsyncState } from "../../../state/types";
import Text from "../../components/Text";
import PasswordForm from "../forms/PasswordForm";
import { PasswordFormValues } from "../forms/types";
import styles from "./DocumentTransitionDialog.styles";

export interface DocumentTransitionDialogPresenterProps {
  onSubmit: (values: PasswordFormValues) => void;
  closeDialog: () => void;
  openDialog: () => void;
  isDialogOpen: boolean;
  asyncState: AsyncState;
  buttonProps?: ButtonProps;
  transition: DocumentTransition;
}

type Props = DocumentTransitionDialogPresenterProps & WithStyles<typeof styles>;

const DocumentTransitionDialogPresenter: React.FunctionComponent<Props> =
  ({ classes, onSubmit, closeDialog, openDialog, isDialogOpen, asyncState, buttonProps, transition }) => {
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
          <Text message={`document.action.${transition}`} />
        </Button>
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          open={isDialogOpen}
          onSubmit={preventPropagation}
        >
          <DialogTitle>
            <Text translation="document.action.title" />
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

export default withStyles(styles)(DocumentTransitionDialogPresenter);
