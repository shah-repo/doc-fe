import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { AsyncState } from "../../../state/types";
import { Translation } from "../../translations/types";
import { FormContext } from "../forms/FormContext";
import Text from "../Text";
import PasswordForm from "./form/PasswordForm";
import { Password } from "./types";

interface Props {
  onSubmit: (values: Password) => void;
  closeDialog: () => void;
  isDialogOpen: boolean;
  asyncState: AsyncState;
  dialogTitle?: Translation;
}

const PasswordDialog: React.FunctionComponent<Props> = ({
  dialogTitle = "transition.action.title",
  asyncState,
  closeDialog,
  isDialogOpen,
  onSubmit,
}) => {
  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = (props: FormikProps<any>) => (
    <PasswordForm {...props} asyncState={asyncState} cancel={closeDialog} />
  );

  return (
    <Dialog
      disableEscapeKeyDown={true}
      disableBackdropClick={true}
      open={isDialogOpen}
      onSubmit={preventPropagation}
    >
      <DialogTitle>
        <Text translation={dialogTitle} />
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
  );
};

export default PasswordDialog;
