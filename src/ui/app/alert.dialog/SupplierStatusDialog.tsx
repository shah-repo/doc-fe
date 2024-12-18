import { Box, Button, Chip, DialogContent, DialogContentText, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import React from 'react';

import { Dialog } from '../../components/dialogs';
import { DialogHandler } from '../../hooks/useDialog';
import { styles } from './AlertDialog.styles';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import WarningIcon from '@material-ui/icons/Warning';
import cx from 'classnames';
import Text from '../../components/Text';
import { IApprovalErrorResponse, IItem } from '../../documentRevision/forms/presenters/SubmitForApproval';
import { Translation } from '../../translations/types';

interface Props {
  confirmAction: (values?) => void
  cancelAction?: (e: React.MouseEvent<HTMLElement>) => void
  data: IApprovalErrorResponse
  dialog: DialogHandler
  confirmLabel?: Translation
  cancelLabel?: Translation
  infoLabel?: Translation
}

const SupplierStatusDialog: React.FunctionComponent<Props> = ({
  dialog,
  confirmAction,
  data,
  cancelAction = dialog.close,
  confirmLabel = 'common.yes.continue',
  cancelLabel = 'common.no.go.back',
  infoLabel = 'common.ok',
}) => {
  const classes = styles();

  if (!dialog.isOpen) {
    return null;
  }

  const title: Translation = data.isError ? 'common.alert' : 'common.warning';

  const getItemDetail = (errorItem: IItem) => {
    return `${errorItem.docId} • ${errorItem.displayRevision} • ${errorItem.phase}`;
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      maxWidth="sm"
      PaperProps={{ id: 'supplierStatusDialog' }}
    >
      <DialogContent>
        <DialogContentText>
          <Grid container className={classes.contentContainer}>
            { data.isError && <Grid item className={classes.alertIcon}>
              <WarningIcon />
            </Grid> }
            { data.isWarning && !data.isError && <Grid item className={classes.warningIcon}>
              <ErrorOutlineIcon />
            </Grid> }
            <Grid item >
              <Typography data-cy="dialog-header" className={classes.alertTitle}>
                <Text translation={title} />
              </Typography>
              <Typography data-cy="dialog-message" className={classes.contentText}>
                <Text translation="purchaseOrder.supplierStatus.dialog.general" />
              </Typography>
              {
                data.errorItems.length > 0
                && <Box className={classes.chipBox}>
                  {
                    data.errorItems.map((errorItem, index) => (
                      <Chip label={getItemDetail(errorItem)} variant="outlined" />
                    ))
                  }
                </Box>
              }
              {
                data.warningItems.length > 0 && data.errorItems.length === 0
                && <Box className={classes.chipBox}>
                  {
                    data.warningItems.map((errorItem, index) => (
                      <Chip label={getItemDetail(errorItem)} variant="outlined" key={index} />
                    ))
                  }
                </Box>
              }
              {
                data.msgs.length > 0
                && <List dense={true} className={classes.topSpacing}>
                  {
                    data.msgs.map((msg: string, index: number) => (
                      <ListItem className={classes.alertDiv} key={index}>
                        <ListItemText primary={msg} />
                      </ListItem>
                    ))
                  }
                </List>
              }
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <Box className={classes.dialogAction}>
        {data.isWarning && !data.isError && <Button
          variant="text"
          className={cx(classes.cancelButton, classes.buttonLabel)}
          onClick={cancelAction}
          id="dialog-cancel"
          data-cy="dialog-cancel"
        >
          <Text translation={cancelLabel} />
        </Button> }
        {data.isWarning && !data.isError && <Button
          variant="contained"
          className={cx(classes.submitButton, classes.buttonLabel)}
          id="dialog-continue"
          data-cy="dialog-continue"
          onClick={confirmAction}
        >
          <Text translation={confirmLabel} />
        </Button> }
        {data.isError && <Button
          variant="contained"
          className={cx(classes.submitButton, classes.buttonLabel)}
          id="dialog-continue"
          data-cy="dialog-continue"
          onClick={cancelAction}
        >
          <Text translation={infoLabel} />
        </Button> }
      </Box>
    </Dialog>
  );
};

export default SupplierStatusDialog;
