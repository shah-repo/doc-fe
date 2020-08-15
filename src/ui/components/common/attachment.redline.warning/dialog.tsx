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
  translationText: Translation;
  translationButtonText?: string;
  setIsDownloading?: (boolean) => void;
}

export const AttachmentRedLineWarningDialog: React.FunctionComponent<Props> = ({
  asyncState,
  closeDialog,
  isDialogOpen,
  onSubmit,
  translationText,
  translationButtonText = "common.attachment.redline.warning.download.label",
}) => {
  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = (props: FormikProps<any>) => (
    <RedlineWarningForm
      {...props}
      asyncState={asyncState}
      cancel={closeDialog}
      translationText = {translationText}
      translationButtonText = {translationButtonText}
    />
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
