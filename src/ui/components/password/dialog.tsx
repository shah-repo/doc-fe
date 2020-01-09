import { Button, ButtonProps, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import Text from "../Text";
import PasswordForm from "./form/PasswordForm";
import { Password } from "./types";

interface Props {
  buttonProps?: ButtonProps;
  label?: string;
}

export const PasswordDialog: React.FunctionComponent<Props> = ({
  buttonProps,
  label,
}) => {
  const dialog = useDialog();
  const async = useAsync<any>({ onSuccess: dialog.close });

  const openDialog = () => {
    async.reset();
    dialog.open();
  };
  const closeDialog = () => {
    dialog.close();
  };

  const onSubmit = (values: Password) => {
    /*
    async.start(
      applyTransition,
      changeRequestId, values, transition, async,
    );
    */
  };
  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = (props: FormikProps<any>) => (
    <PasswordForm {...props} asyncState={async.asyncState} cancel={closeDialog} />
  );

  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        onClick={openDialog}
      >
        <Text translation="common.approve.and.release" />
      </Button>
      <Dialog
        disableEscapeKeyDown={true}
        disableBackdropClick={true}
        open={dialog.isOpen}
        onSubmit={preventPropagation}
      >
        <DialogTitle>
          <Text translation="transition.action.title" />
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ password: "" }}
            onSubmit={onSubmit}
          >
            {renderForm}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PasswordDialog;
