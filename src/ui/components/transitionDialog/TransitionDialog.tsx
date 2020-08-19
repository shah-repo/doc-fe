import { Button, Dialog, DialogContent, DialogTitle, withStyles, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Formik, FormikProps } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { TIME_ZONE } from "../../../common/utils/date";
import { AsyncState } from "../../../state/types";
import AlertDialog from "../../app/alert.dialog/AlertDialog";
import { EffectiveDateFormValues } from "../../change.request/form/types";
import Text from "../../components/Text";
import useDialog from "../../hooks/useDialog";
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

    const effectiveDateDialog = useDialog();
    const [isDatepickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

    useEffect(() => {
      effectiveDateDialog.open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cancelClose = () => {
      effectiveDateDialog.open();
      closeDialog();
      setIsDatePickerOpen(false);
    };

    const renderCloseForm = (props: FormikProps<any>) => (
      <>
        <AlertDialog
          dialog={effectiveDateDialog}
          confirmAction={() => onSubmit({ effectiveDate: moment().tz(TIME_ZONE, true).toISOString() })}
          cancelAction={() => {
            effectiveDateDialog.close();
            setIsDatePickerOpen(true);
          }}
          message={"transition.action.effective.date.message"}
          confirmLabel={"common.true"}
          cancelLabel={"common.false"}
        />
        {isDatepickerOpen && <EffectiveDateForm {...props} asyncState={asyncState} cancel={cancelClose} />}
      </>
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
