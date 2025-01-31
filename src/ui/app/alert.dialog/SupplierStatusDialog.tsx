import { Box, Button, DialogContent, DialogContentText, Grid, Typography } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import WarningIcon from '@material-ui/icons/Warning';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../common/intl';
import { Dialog } from '../../components/dialogs';
import Text from '../../components/Text';
import { IApprovalErrorResponse, IItem } from '../../documentRevision/forms/presenters/SubmitForApproval';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';
import { styles } from './AlertDialog.styles';

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

  const getConflictingPhases = (items: IItem[]) => {
    const itemPhasesSet = new Set(items.map(item => item.phase));
    const phases: string[] = Array.from(itemPhasesSet).map(phase => `${phase} phase`);

    if (phases.length === 1) return phases[0];
    return `${phases.slice(0, -1).join(', ')} and ${phases[items.length - 1]}`;
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
              {
                data.errorItems.length > 0
                && <Typography data-cy="dialog-message" className={classes.contentText}>
                  <Text message={
                    translate('purchaseOrder.supplierStatus.dialog.general', {
                      phases: getConflictingPhases(data.errorItems),
                    })
                  } />
                </Typography>
              }
              {
                data.warningItems.length > 0 && data.errorItems.length === 0
                && <Typography data-cy="dialog-message" className={classes.contentText}>
                  <Text message={
                    translate('purchaseOrder.supplierStatus.dialog.general', {
                      phases: getConflictingPhases(data.warningItems),
                    })
                  } />
                </Typography>
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
