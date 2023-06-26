import { Box, Button, Dialog, DialogContent, DialogContentText, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { ReactComponent as AlertIcon } from '../../../assets/images/alert.svg';
import Text from '../../components/Text';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';
import { styles } from './AlertDialog.styles';

interface Props {
  confirmAction: (values?) => void
  cancelAction?: (e: React.MouseEvent<HTMLElement>) => void
  message: Translation
  dialog: DialogHandler
  confirmLabel?: Translation
  cancelLabel?: Translation
}

/** Dialog with Confirm and Cancel buttons.
 * @param dialog Dialog handler.
 * @param message Text shown in the dialog body.
 * @param confirmAction Function executed on Confirm button click.
 * @param cancelAction Function executed on Cancel button click (optional).
 * @param confirmLabel Confirm button text (optional).
 * @param cancelLabel Cancel button text (optional).
 */
const AlertDialog: React.FunctionComponent<Props> = ({
  dialog,
  message,
  confirmAction,
  cancelAction = dialog.close,
  confirmLabel = 'common.yes.im.sure',
  cancelLabel = 'common.cancel',
}) => {
  const classes = styles();
  return (
    <>
      {
        dialog.isOpen
        && <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          maxWidth="sm"
          PaperProps={{ id: 'alertDialog' }}
        >
          <DialogContent>
            <DialogContentText>
              <Grid container className={classes.contentContainer}>
                <Grid item className={classes.alertIcon}>
                  <AlertIcon />
                </Grid>
                <Grid item >
                  <Typography data-cy="dialog-header" className={classes.alertTitle}>
                    <Text translation="common.alert" />!
                  </Typography>
                  <Typography data-cy="dialog-message" className={classes.contentText}>
                    <Text translation={message} />
                  </Typography>
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <Box className={classes.dialogAction}>
            <Button
              variant="contained"
              className={`${classes.cancelButton} ${classes.buttonLabel}`}
              onClick={cancelAction}
              id="AlertDialog-cancelButton"
              data-cy="AlertDialog-cancelButton"
            >
              <Text translation={cancelLabel} />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={`${classes.submitButton} ${classes.buttonLabel}`}
              id="AlertDialog-continueButton"
              data-cy="AlertDialog-continueButton"
              onClick={confirmAction}
            >
              <Text translation={confirmLabel} />
            </Button>
          </Box>
        </Dialog>
      }
    </>
  );
};

export default AlertDialog;
