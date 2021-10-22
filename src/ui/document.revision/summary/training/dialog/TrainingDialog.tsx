import { Button, createStyles, Dialog, DialogContent, DialogTitle, makeStyles, Typography } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Formik, FormikProps } from "formik";
import React from "react";
import { AsyncState } from "../../../../../state/types";
import { EffectiveDateFormValues } from "../../../../change.request/form/types";
import { FormContext } from "../../../../components/forms/FormContext";
import Text from "../../../../components/Text";
import { PasswordFormValues, Transition } from "../../../../components/transitionDialog/types";
import { DialogHandler } from "../../../../hooks/useDialog";
import TrainingForm from "./TrainingForm";

interface TransitionDialogProps {
  onSubmit: (values: PasswordFormValues | EffectiveDateFormValues) => void;
  openDialog: () => void;
  asyncState: AsyncState;
  buttonProps?: ButtonProps;
  transition: Transition;
  label: string;
  transitionDialog: DialogHandler;
}

type Props = TransitionDialogProps;

const styles = makeStyles(() =>
  createStyles({
    dialogContent: {
      padding: "25px",
    },
  },
  ));

const TrainingDialog: React.FunctionComponent<Props> =
  ({
    onSubmit,
    openDialog,
    asyncState,
    buttonProps,
    transition,
    label,
    transitionDialog,
  }) => {
    const classes = styles();
    const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();

    const renderForm = (props: FormikProps<any>) => (
      <TrainingForm asyncState={asyncState} cancel={transitionDialog.close} />
    );
    return (
      <div>
        <Button
          color= "secondary"
          variant= "outlined"
          aria-label={transition}
          onClick={openDialog}
          data-cy={`training-${transition}`}
          {...buttonProps}
        >
          <Text message={label} />
        </Button>
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          open={transitionDialog.isOpen}
          onSubmit={preventPropagation}
          classes={{ paper: classes.dialogContent }}
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">
              <Text translation={"training.acknowledge.completion"} />
            </Typography>
          </DialogTitle>

          <DialogContent>
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik
                initialValues={{ password: "" }}
                onSubmit={onSubmit}
              >
                {renderForm}
              </Formik>
            </FormContext.Provider>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

export default TrainingDialog;
