import { Box, Button, Dialog, DialogContent, DialogContentText, Typography, withStyles, WithStyles } from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React from "react";
import Text from "../../../../components/Text";
import { DialogHandler } from "../../../../hooks/useDialog";
import { Translation } from "../../../../translations/types";
import styles from "./TransitionDialog.styles";

interface TransitionDialogProps {
  onSubmit: () => void;
  cancelAction?: () => void;
  message: Translation;
  dialog: DialogHandler;
  confirmLabel?: Translation;
  cancelLabel?: Translation;
}

/** Dialog with Confirm and Cancel buttons.
 * @param dialog Dialog handler.
 * @param message Text shown in the dialog body.
 * @param onSubmit Function executed on Confirm button click.
 * @param cancelAction Function executed on Cancel button click (optional).
 * @param confirmLabel Confirm button text (optional).
 * @param cancelLabel Cancel button text (optional).
 */


type Props = TransitionDialogProps & WithStyles<typeof styles>;

const AlertDialog: React.FunctionComponent<Props> = ({
  classes,
  dialog,
  message,
  onSubmit,
  cancelAction = dialog.close,
  confirmLabel = "common.yes.im.sure",
  cancelLabel = "common.cancel",
}) => (
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
              onClick={cancelAction}
              id="AlertDialog-cancelButton"
            >
              <Text translation={cancelLabel} />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButton}
              id="AlertDialog-continueButton"
              data-cy="AlertDialog-continueButton"
              onClick={onSubmit}
            >
              <Text translation={confirmLabel} />
            </Button>
          </Box>
        </Dialog>
    }
  </>
);

export default withStyles(styles)(AlertDialog);
