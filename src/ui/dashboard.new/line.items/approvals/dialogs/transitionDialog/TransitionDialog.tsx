import { Dialog, DialogContent, Grid, IconButton, Typography, withStyles, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Formik, FormikProps } from "formik";
import moment from "moment";
import React from "react";
// import { ReactComponent as ModelCloseIcon } from "../../../../../../../../assets/images/modelClose.svg";
import { ReactComponent as ModelCloseIcon } from "../../../../../../../src/assets/images/modelClose.svg";
// src/assets/images/modelClose.svg
import { AsyncState } from "../../../../../../state/types";
import AlertDialog from "../../../../../app/alert.dialog/AlertDialog";
import { EffectiveDateFormValues } from "../../../../../change.request/form/types";
import EffectiveDateForm from "../../../../../components/effectiveDate/form/EffectiveDateForm";
import { FormContext } from "../../../../../components/forms/FormContext";
import { DialogHandler } from "../../../../../hooks/useDialog";
import PasswordFormApproval from "./form/PasswordForm";
import styles from "./TransitionDialog.styles";
import { PasswordFormValues, Transition } from "./types";

interface TransitionDialogProps {
  onSubmit: (values: PasswordFormValues | EffectiveDateFormValues) => void;
  // openDialog: () => void;
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
    // openDialog,
    asyncState,
    buttonProps,
    transition,
    label,
    transitionDialog,
    effectiveDateDialog,
  }) => {
    const renderPasswordForm = (props: FormikProps<any>) => (
      <PasswordFormApproval {...props} asyncState={asyncState} cancel={transitionDialog.close} />
    );

    const renderCloseForm = (props: FormikProps<any>) => (
      <EffectiveDateForm {...props} asyncState={asyncState} cancel={transitionDialog.close} />
    );

    const isReject = transition === "reject" ? true : false;

    const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();
    return (
      <div className={classes.container}>
        {/* <Button
          color= "secondary"
          variant= "outlined"
          aria-label={transition}
          onClick={openDialog}
          data-cy={`transition-${transition}`}
          {...buttonProps}
        >
          <Text message={label} />
        </Button> */}
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
          // className={classes.paper}
        >
          <div className={classes.paper}>
            <Grid container justify="space-between">
              <Grid item>
                <Typography
                  variant="h2"
                  component="h2"
                  id="simple-modal-title"
                  className={classes.modeltitle}
                >
                  {/* <Text message={transition === "reject" ? "Reject Request" : "Approve Request"} /> */}
                  {isReject && <span>Reject Request</span>}
                  {!isReject && <span>Approve Request</span>}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="close"
                  className={classes.closemodel}
                  onClick={transitionDialog.close}
                >
                  <ModelCloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            {/* <DialogTitle>
            <Text translation={transition === "closed" ? "transition.action.close.date" : "transition.action.title"} />
          </DialogTitle> */}
            <DialogContent className={classes.pendingBox}>
              <FormContext.Provider value={{ submitOnChange: false }}>
                <Formik
                  initialValues={transition === "closed" ? { effectiveDate: "" } : { password: "" }}
                  onSubmit={onSubmit}
                >
                  {transition === "closed" ? renderCloseForm : renderPasswordForm}
                </Formik>
              </FormContext.Provider>
            </DialogContent>
          </div>
        </Dialog>
      </div>
    );
  };

export default withStyles(styles)(TransitionDialog);
