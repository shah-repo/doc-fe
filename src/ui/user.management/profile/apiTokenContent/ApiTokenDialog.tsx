import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Form, Formik } from "formik";
import React from "react";
import { FormContext } from "../../../components/forms/FormContext";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "./ApiToken.style";
import ApiTokenResponseFormPresenter from "./ApiTokenResponseForm.presenter";

interface Props {
  dialog: DialogHandler;
  apiTokenName: string;
  apiTokenKey: string;
  apiTokenSecret: string;
}

const ApiTokenDialog: React.FunctionComponent<Props> = ({
  dialog,
  apiTokenName,
  apiTokenKey,
  apiTokenSecret,
}) => {
  const classes = styles();

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();

  const renderForm = () => (
    <Form>
      <ApiTokenResponseFormPresenter
        apiTokenKey={apiTokenKey}
        apiTokenSecret={apiTokenSecret}
      />
    </Form>
  );

  const initialValues = {
    name: apiTokenName,
    key: apiTokenKey,
    secret: apiTokenSecret,
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onSubmit={preventPropagation}
      onClose={dialog.close}
    >
      <IconButton onClick={dialog.close} className={classes.closeButton}>
        <CloseIcon />
      </IconButton>
      <DialogTitle className={classes.dialogTitle}>
        <Text translation="api.token.title" />
      </DialogTitle>
      <DialogContent>
        <FormContext.Provider value={{ submitOnChange: false }}>
          <Formik
            initialValues={initialValues}
            onSubmit={dialog.close}
          >
            {renderForm}
          </Formik>
        </FormContext.Provider>
        <Box display="flex" marginBottom={2} >
          <Typography variant="subtitle1" className={classes.dialogMessage}>
            <Text translation="api.token.note" />
          </Typography>
          <Typography variant="subtitle1">
            <Text translation="api.token.message" />
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ApiTokenDialog;
