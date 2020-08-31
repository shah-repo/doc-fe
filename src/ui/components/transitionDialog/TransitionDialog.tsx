import { Button, Dialog, DialogContent, DialogTitle, withStyles, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Formik, FormikProps } from "formik";
import moment from "moment";
import React from "react";
import { AsyncState } from "../../../state/types";
import AlertDialog from "../../app/alert.dialog/AlertDialog";
import { EffectiveDateFormValues } from "../../change.request/form/types";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
import EffectiveDateForm from "../effectiveDate/form/EffectiveDateForm";
import { FormContext } from "../forms/FormContext";
import PasswordForm from "../password/form/PasswordForm";
import styles from "./TransitionDialog.styles";
import { PasswordFormValues, Transition } from "./types";

export interface TransitionDialogProps {
  onSubmit: (values: PasswordFormValues | EffectiveDateFormValues) => void;
  openDialog: () => void;
  asyncState: AsyncState;
  buttonProps?: ButtonProps;
  transition: Transition;
  label: string;
  transitionDialog: DialogHandler;
  effectiveDateDialog?: DialogHandler;
}

type Props = TransitionDialogProps & WithStyles<typeof styles>;

const TransitionDialog: React.FunctionComponent<Props> =
  ({
    classes,
    onSubmit,
    openDialog,
    asyncState,
    buttonProps,
    transition,
    label,
    transitionDialog,
    effectiveDateDialog,
  }) => {
    const renderPasswordForm = (props: FormikProps<any>) => (
      <PasswordForm {...props} asyncState={asyncState} cancel={transitionDialog.close} />
    );

    const renderCloseForm = (props: FormikProps<any>) => (
      <EffectiveDateForm {...props} asyncState={asyncState} cancel={transitionDialog.close} />
    );

    const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();
    return (
      <div className={classes.container}>
        <Button
          color= "secondary"
          variant= "outlined"
          aria-label={transition}
          onClick={openDialog}
          data-cy={`transition-${transition}`}
          {...buttonProps}
        >
          <Text message={label} />
        </Button>
        {effectiveDateDialog && (
          <AlertDialog
            dialog={effectiveDateDialog}
            confirmAction={() => onSubmit({ effectiveDate: moment.utc().toISOString() })}
            cancelAction={() => {
              effectiveDateDialog.close();
              transitionDialog.open();
            }}
            message={"transition.action.effective.date.message"}
            confirmLabel={"common.true"}
            cancelLabel={"common.false"}
          />
        )}
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          open={transitionDialog.isOpen}
          onSubmit={preventPropagation}
        >
          <DialogTitle>
            <Text translation={transition === "closed" ? "transition.action.close.date" : "transition.action.title"} />
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
