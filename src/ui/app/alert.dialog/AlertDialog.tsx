import { Box, Button, Dialog, DialogContent, DialogContentText, Typography } from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React from "react";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
import { Translation } from "../../translations/types";
import { styles } from "./AlertDialog.styles";

interface Props {
  action: () => void;
  message: Translation;
  dialog: DialogHandler;
}

const AlertDialog: React.FunctionComponent<Props> = ({
  action,
  message,
  dialog,
}) => {
  const classes = styles();
  return (
    <>
      {
        dialog.isOpen &&
        <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          maxWidth="sm"
          PaperProps={{ id: "alertDialog" }}
        >
          <DialogContent>
            <Box textAlign="center" marginBottom="20px" whiteSpace="pre-line">
              <Box textAlign="center">
                <span className={classes.iconContainer}>
                  <ReportProblemOutlinedIcon color="error" />
                </span>
                <Typography variant="h6" style={{ marginTop: 20, marginBottom: 5 }}>
                  <Text translation="common.alert" />
                </Typography>
              </Box>
              <DialogContentText>
                <Box className={classes.dialogContent}>
                  <Text translation={message} />
                </Box>
              </DialogContentText>
            </Box>
          </DialogContent>
          <Box className={classes.dialogAction} >
            <Button
              variant="contained"
              className={classes.cancelButton}
              onClick={dialog.close}
              id="AlertDialog-cancelButton"
            >
              <Text translation="common.cancel" />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButton}
              id="AlertDialog-continueButton"
              data-cy="AlertDialog-continueButton"
              onClick={action}
            >
              <Text translation="common.yes.im.sure" />
            </Button>
          </Box>
        </Dialog>
      }
    </>
  );
};

export default AlertDialog;
