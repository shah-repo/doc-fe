import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { AsyncActionPayload } from "../../../state/types";
import { FormContext } from "../../components/forms/FormContext";
import PasswordForm from "../../components/password/form/PasswordForm";
import Text from "../../components/Text";
import { FBInlineApprovalTransition } from "../../form.builder";
import { DialogHandler } from "../../hooks/useDialog";

interface Props {
  asyncState: AsyncActionPayload;
  approvalId: string;
  changeApprovalStatus(transition: FBInlineApprovalTransition, approvalId?: string, password?: string): void;
  passwordDialog: DialogHandler;
}

export const DocumentRevisionApprovalDialog: React.FunctionComponent<Props> = ({
  asyncState,
  changeApprovalStatus,
  approvalId,
  passwordDialog,
}) => {

  const renderPasswordForm = (props: FormikProps<any>) => (
    <PasswordForm {...props} asyncState={asyncState} cancel={passwordDialog.close} />
  );

  return (
    <Dialog
      disableEscapeKeyDown={true}
      disableBackdropClick={true}
      open={passwordDialog.isOpen}
    >
      <DialogTitle>
        <Text translation="document.action.title" />
      </DialogTitle>
      <DialogContent>
        <FormContext.Provider value={{ submitOnChange: false }}>
          <Formik
            initialValues={{ password: "" }}
            onSubmit={(value) => {
              changeApprovalStatus("approve", approvalId, value.password);
              passwordDialog.close();
            }}
          >
            {renderPasswordForm}
          </Formik>
        </FormContext.Provider>
      </DialogContent>
    </Dialog>
  );
};
