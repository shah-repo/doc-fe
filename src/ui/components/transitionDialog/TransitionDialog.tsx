import { Button, Dialog, DialogContent, DialogTitle, withStyles, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Formik, FormikProps } from "formik";
import React from "react";
import { AsyncState } from "../../../state/types";
import { EffectiveDateFormValues } from "../../change.request/form/types";
import Text from "../../components/Text";
import EffectiveDateForm from "../effectiveDate/form/EffectiveDateForm";
import { FormContext } from "../forms/FormContext";
import PasswordForm from "../password/form/PasswordForm";
import styles from "./TransitionDialog.styles";
import { PasswordFormValues, Transition } from "./types";

export interface TransitionDialogProps {
  onSubmit: (values: PasswordFormValues | EffectiveDateFormValues) => void;
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
    const renderPasswordForm = (props: FormikProps<any>) => (
      <PasswordForm {...props} asyncState={asyncState} cancel={closeDialog} />
    );

    const renderCloseForm = (props: FormikProps<any>) => (
      <EffectiveDateForm {...props} asyncState={asyncState} cancel={closeDialog} />
    );

    const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();

    return (
      <div className={classes.container}>
        <Button
          color= "secondary"
          variant= "outlined"
          aria-label={transition}
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
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik
                initialValues={transition === "closed" ? { effectiveDate: "" } : { password: "" }}
                onSubmit={onSubmit}
              >
                {transition === "closed" ? renderCloseForm : renderPasswordForm}
              </Formik>
            </FormContext.Provider>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

export default withStyles(styles)(TransitionDialog);
