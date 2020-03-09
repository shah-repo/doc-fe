import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import copy from "copy-to-clipboard";
import { Form, Formik } from "formik";
import React from "react";
import { ReactComponent as CopyIcon } from "../../../../assets/images/copy.svg";
import InputField from "../../../components/forms/fields/Input";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "./ApiToken.style";

export interface Props {
  dialog: DialogHandler;
  apiTokenName: string;
  apiTokenKey: string;
  apiTokenSecret: string;
}

export const ApiTokenDialog: React.FunctionComponent<Props> = ({
  dialog,
  apiTokenName,
  apiTokenKey,
  apiTokenSecret,
}) => {
  const classes = styles();

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();

  const renderForm = () => (
    <Form>
      <InputField
        name="name"
        label="common.name"
        inputProps={{ id: "ApiTokenDialog-name", disabled: true }}
      />
      <div>
        <Button
          className={classes.copyKeyButton}
          color="primary"
          id="ApiTokenDialog-copyKey"
          onClick={() => copy(apiTokenKey)}>
          <CopyIcon className={classes.icon} />
          <Text translation="api.token.copy.key" />
        </Button>
        <InputField
          name="key"
          label="api.token.key"
          inputProps={{ id: "ApiTokenDialog-key", disabled: true }}
        />
      </div>
      <div>
        <Button
          className={classes.copySecretButton}
          color="primary"
          id="ApiTokenDialog-copySecret"
          onClick={() => copy(apiTokenSecret)}>
          <CopyIcon className={classes.icon} />
          <Text translation="api.token.copy.secret" />
        </Button>
        <InputField
          name="secret"
          label="api.token.secret"
          inputProps={{ id: "ApiTokenDialog-secret", disabled: true }}
        />
      </div>
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
        <Formik
          initialValues={initialValues}
          onSubmit={dialog.close}
        >
          {renderForm}
        </Formik>
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
