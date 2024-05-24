import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Dialog, DialogContent, DialogContentText, Grid, Typography } from '@material-ui/core';
import { isNil } from 'lodash';
import React from 'react';
import { ReactComponent as AlertIcon } from '../../../assets/images/alert.svg';
import Text from '../../components/Text';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';
import { styles } from './styles';

interface Props {
  confirmAction: (values?) => void
  cancelAction?: (e: React.MouseEvent<HTMLElement>) => void
  message: Translation
  dialog: DialogHandler
  confirmLabel?: Translation
  cancelLabel?: Translation
  type?: DialogTypes
  title?: Translation
}

export enum DialogTypes {
  Warning = 'warning',
  Info = 'info',
  Alert = 'alert',
}

const ExpiredLOTDialog: React.FunctionComponent<Props> = ({
  dialog,
  message,
  confirmAction,
  cancelAction = dialog.close,
  confirmLabel = 'common.yes.im.sure',
  cancelLabel = 'common.cancel',
  type,
  title,
}) => {
  const classes = styles();
  const isAlert = isNil(type) || type === DialogTypes.Alert;
  return (
    <>
      {
        dialog.isOpen
        && <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          maxWidth="sm"
          PaperProps={{ id: 'tasksDialog' }}
        >
          <DialogContent>
            <DialogContentText>
              <Grid container className={classes.contentContainer}>
                <Grid item className={classes.alertIcon}>
                  {type === DialogTypes.Warning && <FontAwesomeIcon className={classes.warningIcon} icon={light('circle-exclamation')} />}
                  {type === DialogTypes.Info && <FontAwesomeIcon className={classes.infoIcon} icon={light('circle-exclamation')} />}
                  {isAlert && <AlertIcon />}
                </Grid>
                <Grid item >
                  <Typography data-cy="dialog-header" className={classes.alertTitle}>
                    <Text translation={title || 'common.alert'} />{isAlert ? '!' : ''}
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
              id="expired-lot-dialog-cancel-button"
              data-cy="expired-lot-dialog-cancel-button"
            >
              <Text translation={cancelLabel} />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={`${classes.submitButton} ${classes.buttonLabel}`}
              id="expired-lot-dialog-confirm-button"
              data-cy="expired-lot-dialog-confirm-button"
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

export default ExpiredLOTDialog;
