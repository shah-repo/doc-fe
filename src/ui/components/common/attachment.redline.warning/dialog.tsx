import { Dialog, DialogContent } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { AsyncState } from "../../../../state/types";
import { Translation } from "../../../translations/types";
import { FormContext } from "../../forms/FormContext";
import RedlineWarningForm from "./form/warningform";

interface Props {
  onSubmit: () => void;
  closeDialog: () => void;
  isDialogOpen: boolean;
  asyncState: AsyncState;
  dialogTitle?: Translation;
  copy: any;
}

export const AttachmentRedLineWarningDialog: React.FunctionComponent<Props> = ({
  asyncState,
  closeDialog,
  isDialogOpen,
  onSubmit,
  copy,
}) => {
  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = (props: FormikProps<any>) => (
    <RedlineWarningForm {...props} asyncState={asyncState} cancel={closeDialog} copy={copy}/>
  );

  return (
    <Dialog
      disableEscapeKeyDown={true}
      disableBackdropClick={true}
      open={isDialogOpen}
      onSubmit={preventPropagation}
    >
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

export default AttachmentRedLineWarningDialog;
